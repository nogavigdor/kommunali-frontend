import { useFirebaseApp, useDocument, useCollection, useCurrentUser } from "vuefire";
import { doc, collection, query, where, updateDoc, arrayUnion, getDoc, getDocs, getFirestore } from "firebase/firestore";
import { useUserStore } from "@/stores/user";
import { useShopsStore } from "@/stores/shops";
import type { IUser } from "@/types/user";

const shopsStore = useShopsStore();

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
	const getShopChats = async (shopId: string) => {
		if (!shopId) throw new Error("Shop ID is required to fetch chats");

		const db = getFirestore();
		const shopOwnerId = shopsStore.userShop?.ownerFirebaseId; // Ensure this fetches the correct owner ID
		const currentUser = useCurrentUser();
		console.log("The current user is:", currentUser.value);
		if (!shopOwnerId) throw new Error("Shop owner ID is not available");

		console.log("The shop owner ID is:", shopOwnerId);

		// Reference the chats subcollection
		const chatsRef = collection(db, "shopChats", shopId, "chats");

		// Query to filter by shopOwner
		const chatsQuery = query(chatsRef, where("shopOwner", "==", shopOwnerId));
		const snapshot = await getDocs(chatsQuery);

		if (snapshot.empty) {
			console.log("No chats found for shop ID:", shopId);
			return [];
		}

		// Map the results to a readable format
		return snapshot.docs.map((doc) => {
			const data = doc.data();
			const lastMessage = data.messages?.[data.messages.length - 1];

			return {
				chatFirebaseId: doc.id,
				customer: data.customer || "Unknown",
				lastMessageNickname: lastMessage?.nickname || "Unknown",
				lastMessageText: lastMessage?.text || "No message",
				lastMessageTimestamp: lastMessage?.timestamp
					? new Date(lastMessage.timestamp)
					: new Date(),
			};
		});
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
		getShopChats,
		sendMessageToChat,
	};
}
