<template>
	<div
		v-if="isOpen"
		class="fixed bottom-20 right-8 w-96 bg-white rounded-4xl shadow-strong border border-brandGray-300 p-4 flex flex-col">
		<!-- Header -->
		<div class="flex items-center justify-between border-b pb-3 mb-3 border-brandGray-200">
			<h3 class="text-brandPrimary-500 font-heading text-lg">
				Chat
			</h3>
			<button
				class="text-brandGray-500 hover:text-error-dark transition"
				@click="toggleChat">
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
				{{ message.text }}
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
import { useCurrentUser, useFirebaseApp, useDocument } from "vuefire";

import { doc, getFirestore } from "firebase/firestore";

import { useCustomFirestore } from "../composables/useChat";

const props = defineProps<{
	selectedShopId: string;
	chatId: string | undefined;
}>();

const firebaseApp = useFirebaseApp();
const db = getFirestore(firebaseApp);

const { getChatMessages, createChat, sendMessageToChat } = useCustomFirestore();
const { value: currentUser } = useCurrentUser(); // Reactive current user

const isOpen = ref(true); // Chat visibility
const newMessage = ref("");

// const chatData = ref<DocumentData>({});
const chatData = props.chatId ? useDocument(doc(db, "shopChats", props.selectedShopId, "chats", props.chatId)) : ref(null);

// if (props.chatId) {
// 	chatData.value = getChatMessages(props.chatId, props.selectedShopId);
// }

// Watch for chatId changes
// watch(() => props.chatId, (newChatId) => {
// 	if (newChatId) {
// 		chatData.value = getChatMessages(newChatId, props.selectedShopId);
// 	}
// });
// Computed property for chat messages
const messages = computed(() => chatData.value?.messages || []);

// Toggle chat visibility
const toggleChat = () => {
	isOpen.value = !isOpen.value;
};

// Send a new message
const sendMessage = async () => {
	if (!props.chatId) {
		await createChat(props.selectedShopId);
	}
	if (!newMessage.value.trim() || !currentUser?.uid) return;

	const message = {
		senderId: currentUser.uid,
		text: newMessage.value.trim(),
		timestamp: Date.now(),
	};

	await sendMessageToChat(props.chatId, props.selectedShopId, message);
	newMessage.value = ""; // Clear the input field
};
</script>
