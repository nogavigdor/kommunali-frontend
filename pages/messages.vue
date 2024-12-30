<template>
	<div class="page-transition">
		<div class="flex justify-between items-center mb-4">
			<h1 class="text-2xl font-bold">
				Shop Chats Inbox
			</h1>
			<ToLink
				link="/"
				icon="arrow-left"
				tooltip-text="Back to Home Page" />
		</div>
		<p>Manage your shop's message history below.</p>

		<!-- Chat List -->
		<div
			v-if="shopChats.length > 0"
			class="mt-4 space-y-2">
			<div
				v-for="chat in shopChats"
				:key="chat.chatFirebaseId"
				class="flex items-center justify-between p-4 rounded-lg bg-neutral-light shadow-soft hover:bg-neutral-dark hover:text-white transition-all cursor-pointer"
				@click="selectChat(chat)">
				<!-- Chat Summary -->
				<div>
					<p class="font-semibold">
						{{ chat.lastMessageNickname }}
					</p>
					<p class="text-sm text-gray-500 truncate">
						{{ chat.lastMessageText }}
					</p>
					<p class="text-xs text-gray-400">
						{{ formatTimestamp(chat.lastMessageTimestamp) }}
					</p>
				</div>
				<Icon
					name="uil:angle-right"
					class="text-lg" />
			</div>
		</div>

		<!-- No Chats -->
		<p
			v-else
			class="text-gray-500 mt-4">
			No chats available.
		</p>

		<!-- ChatBox -->
		<ClientOnly>
			<ChatBox
				v-if="showChatBox"
				:selected-shop-id="selectedShopId"
				:chat-id="selectedChatId"
				@close-chat="closeChatBox" />
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import { useCustomFirestore } from "@/composables/useChat";
import { useShopsStore } from "@/stores/shops";

const shopsStore = useShopsStore();

// Composable to interact with Firestore
const { getShopChats } = useCustomFirestore();

const shopChats = ref<{ lastMessageNickname: string; lastMessageText: string; lastMessageTimestamp: number }[]>([]); // Holds chat summaries
const selectedShopId = ref(""); // Current shop ID
const selectedChatId = ref(""); // Current chat ID
const showChatBox = ref(false); // Controls visibility of ChatBox

// Fetch chats for the shop owner

// Fetch chats for the shop owner
const fetchShopChats = async () => {
	try {
		const shopId = shopsStore.userShop?._id || ""; // Ensure the shop ID is retrieved
		if (!shopId) {
			console.error("No shop ID available");
			return;
		}
		console.log("from messages page: Shop ID:", shopId); // Debugging log
		const chats = await getShopChats(shopId); // Fetch chats

		shopChats.value = chats; // Assign fetched chats to the reactive variable
		console.log("Shop Chats:", shopChats.value); // Debugging log
	}
	catch (error) {
		console.error("Error fetching shop chats:", error);
	}
};
// Format timestamp into a readable date
const formatTimestamp = (timestamp) => {
	return format(new Date(timestamp), "dd/MM/yyyy HH:mm");
};

// Select a chat and open ChatBox
const selectChat = (chat) => {
	selectedShopId.value = chat.shopId;
	selectedChatId.value = chat.chatFirebaseId;
	showChatBox.value = true;
};

// Close the ChatBox
const closeChatBox = () => {
	showChatBox.value = false;
};

// Fetch chats on page load
onMounted(fetchShopChats);
</script>

  <style scoped>
  .cursor-pointer {
	cursor: pointer;
  }
  </style>
