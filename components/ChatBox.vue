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
					name="close"
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
import { useCurrentUser } from "vuefire";
import { useFirestore } from "@/composables/useFirestore";
import { useShopsStore } from "@/stores/shops";

const shopsStore = useShopsStore();

const props = defineProps<{
	selectedShopId: string | undefined;
}>();

const { generateChatId, getChat, sendMessageToChat } = useFirestore();
const { value: currentUser } = useCurrentUser(); // Reactive current user

const isOpen = ref(true); // Chat visibility
const newMessage = ref("");
const ownerFirebaseId = props.selectedShopId ? shopsStore.getShopById(props.selectedShopId)?.ownerFirebaseId : undefined;
// Generate a unique chat ID based on user IDs
const chatId = ownerFirebaseId && currentUser?.uid ? generateChatId(ownerFirebaseId, currentUser.uid) : "";

// Fetch chat data reactively from Firestore
const { data: chatData } = getChat(chatId);

// Computed property for chat messages
const messages = computed(() => chatData.value?.messages || []);

// Toggle chat visibility
const toggleChat = () => {
	isOpen.value = !isOpen.value;
};

// Send a new message
const sendMessage = async () => {
	if (!newMessage.value.trim() || !currentUser?.uid) return;

	const message = {
		senderId: currentUser.uid,
		text: newMessage.value.trim(),
		timestamp: Date.now(),
	};

	await sendMessageToChat(chatId, message);
	newMessage.value = ""; // Clear the input field
};
</script>
