<template>
	<div
		class="absolute top-0 left-0 z-30 w-full h-full bg-white rounded-4xl shadow-strong border border-brandGray-300 p-4 flex flex-col">
		<!-- Header -->
		<div class="flex items-center justify-between border-b pb-3 mb-3 border-brandGray-200">
			<h3 class="text-brandPrimary-500 font-heading text-lg">
				Chat with {{ customerNickname || "Unknown" }}
			</h3>
			<button
				class="text-brandGray-500 hover:text-error-dark transition"
				@click="$emit('closeChat')">
				<Icon
					name="uil:times"
					class="w-5 h-5" />
			</button>
		</div>

		<!-- Messages -->
		<div class="flex-1 overflow-y-auto space-y-4">
			<div
				v-for="message in messages"
				:key="message.timestamp"
				:class="{
					'self-end bg-brandPrimary-100 text-brandPrimary-700': message.senderId === currentUser?.uid,
					'self-start bg-brandGray-100 text-brandGray-700': message.senderId !== currentUser?.uid,
				}"
				class="max-w-xs px-4 py-2 rounded-lg shadow-soft">
				{{ formatTimestamp(message.timestamp) }} {{ message.nickname || "Unknown" }}: {{ message.text }}
			</div>
		</div>

		<!-- Input -->
		<div class="mt-3 flex items-center">
			<input
				v-model="newMessage"
				type="text"
				placeholder="Type a message..."
				class="form-input flex-1">
			<button
				class="btn-accent ml-3 px-4 py-2 rounded-lg shadow-medium"
				:disabled="!newMessage.trim()"
				@click="sendMessage">
				Send
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { DocumentData } from "firebase/firestore";
import { useCurrentUser, useFirebaseApp, useDocument } from "vuefire";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useCustomFirestore } from "../composables/useChat";

const props = defineProps<{
	selectedShopId: string;
	chatId: string | undefined;
	customerNickname: string; // Pass the nickname from parent
}>();

defineEmits(["closeChat"]);

const firebaseApp = useFirebaseApp();
const db = getFirestore(firebaseApp);

const { sendMessageToChat } = useCustomFirestore();
const { value: currentUser } = useCurrentUser(); // Reactive current user

const newMessage = ref("");

const chatData = ref<DocumentData | null>(null);
const messages = ref<Array<{ nickname: string; senderId: string; text: string; timestamp: number }>>([]);

const fetchChatData = async () => {
	if (!props.chatId || !props.selectedShopId) return;

	const chatRef = doc(db, "shopChats", props.selectedShopId, "chats", props.chatId);
	const chatSnap = await getDoc(chatRef);

	if (chatSnap.exists()) {
		chatData.value = chatSnap.data();
		messages.value = chatData.value.messages || [];
	}
	else {
		console.error("Chat document not found.");
		messages.value = [];
	}
};

watch(() => props.chatId, fetchChatData);

onMounted(fetchChatData);

const sendMessage = async () => {
	if (!props.chatId || !newMessage.value.trim() || !currentUser?.uid) return;

	const message = {
		nickname: currentUser.displayName || "Anonymous",
		senderId: currentUser.uid,
		text: newMessage.value.trim(),
		timestamp: Date.now(),
	};

	await sendMessageToChat(props.chatId, props.selectedShopId, message);

	// Added the message to the local state immediately for a better UX
	messages.value.push(message);
	newMessage.value = ""; // Clear the input field
};

const formatTimestamp = (timestamp: number) => {
	return new Date(timestamp).toLocaleString();
};
</script>
