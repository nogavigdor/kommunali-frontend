import { useFirebaseApp, useDocument, useCollection, useCurrentUser } from "vuefire";
import { doc, collection, query, where, updateDoc, arrayUnion, getDoc, getFirestore } from "firebase/firestore";
import { useUserStore } from "@/stores/user";
import type { IUser } from "@/types/user";

const config = useRuntimeConfig();

const userStore = useUserStore();
const firebaseApp = useFirebaseApp();
const db = getFirestore(firebaseApp);

export function useCustomFirestore() {
	const currentUser = useCurrentUser();

	// create chat
	const createChat = async (shopId: string) => {
		const token = await currentUser.value?.getIdToken();
		const user = await $fetch<IUser>(`${config.public.apiBaseUrl}/api/chats/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
			// product id is null since we are creating a chat for the shop
			// in future app version we can create chat for a specific product
			body: JSON.stringify({ shopId, productId: null }),
		});
		userStore.user = user;
		return getChatId(shopId);
	};
	// Reactive binding for a single chat document
	const getChatMessages = (chatId: string, shopId: string) => {
		const chatRef = doc(db, "shopChats", shopId, "chats", chatId);
		return useDocument(chatRef); // Returns a reactive document
	};

	// Fetch all chats for the current user
	const getUserChats = () => {
		if (!currentUser.value) throw new Error("User is not authenticated");

		const chatsRef = collection(db, "chats");
		// Create a Firestore query
		const userChatsQuery = query(chatsRef, where("participants", "array-contains", currentUser.value.uid));
		return useCollection(userChatsQuery); // Pass the Firestore query to useCollection
	};

	// Add a message to a specific chat
	const sendMessageToChat = async (chatId: string, shopId: string, message: { nickname: string; senderId: string; text: string; timestamp: number }) => {
		const chatRef = doc(db, "shopChats", shopId, "chats", chatId);

		// Ensure the chat document exists
		const chatSnap = await getDoc(chatRef);
		if (!chatSnap.exists()) {
			throw new Error("Chat does not exist");
		}

		// Add the new message to the chat
		await updateDoc(chatRef, {
			messages: arrayUnion(message),
		});
	};

	const getChatId = (shopId: string) => {
		return userStore.getChatId(shopId);
	};

	return {
		createChat,
		getChatId,
		getChatMessages,
		getUserChats,
		sendMessageToChat,
	};
}
