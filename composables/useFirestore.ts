import { useDocument, useCollection, useCurrentUser } from "vuefire";
import { doc, collection, query, where, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/composables/useFirebaseClient"; // Firebase Client SDK setup

export function useFirestore() {
	const currentUser = useCurrentUser();

	// Generate a chat ID based on the two user IDs
	const generateChatId = (user1: string, user2: string) => {
		return [user1, user2].sort().join("_"); // Ensure consistency regardless of user order
	};

	// Reactive binding for a single chat document
	const getChat = (chatId: string) => {
		const chatRef = doc(db, "chats", chatId);
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
	const sendMessageToChat = async (chatId: string, message: { senderId: string; text: string; timestamp: number }) => {
		const chatRef = doc(db, "chats", chatId);

		// Ensure the chat document exists
		const chatSnap = await getDoc(chatRef);
		if (!chatSnap.exists()) {
			await setDoc(chatRef, { participants: [currentUser.value?.uid], messages: [] });
		}

		// Add the new message to the chat
		await updateDoc(chatRef, {
			messages: arrayUnion(message),
		});
	};

	// Initialize Firestore document if it doesn’t exist (helper function)
	const initializeDocument = async (path: string, defaultData: any) => {
		const docRef = doc(db, path);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) {
			await setDoc(docRef, defaultData);
		}
	};

	return {
		generateChatId,
		getChat,
		getUserChats,
		sendMessageToChat,
		initializeDocument,
	};
}
