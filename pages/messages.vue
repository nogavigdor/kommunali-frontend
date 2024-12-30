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

		<!-- My shop Chat List -->
		<div
			v-if="shopChats.length > 0"
			class="mt-4 space-y-2">
			<div
				v-for="chat in shopChats"
				:key="chat.lastMessageTimestamp"
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
		<!-- Chats I've initiated with other shops -->
		<div
			v-if="shopChats.length > 0"
			class="mt-4 space-y-2">
			<div
				v-for="chat in userChats"
				:key="chat.message.timestamp"
				class="flex items-center justify-between p-4 rounded-lg bg-neutral-light shadow-soft hover:bg-neutral-dark hover:text-white transition-all cursor-pointer"
				@click="selectChat(chat)">
				<!-- Chat Summary -->
				<div>
					<p class="font-semibold">
						{{ chat.message.nickname }}
					</p>
				</div>
				<Icon
					name="uil:angle-right"
					class="text-lg" />
			</div>
		</div>

		<!-- ChatBox -->
		<ClientOnly>
			<ChatBox
				v-show="showChatBox"
				:selected-shop-id="selectedShopId"
				:chat-id="selectedChatId"
				@close-chat="closeChatBox" />
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import type { get } from "firebase/database";
import type { Timestamp } from "firebase-admin/firestore";
import { useCustomFirestore } from "@/composables/useChat";
import { useShopsStore } from "@/stores/shops";
import { useUserStore } from "@/stores/user";

const shopsStore = useShopsStore();
const userStore = useUserStore();

const chatsInitiated = computed(() => userStore.user.chatsInitiated);

// Composable to interact with Firestore
const { getShopChats, getChatByChatId } = useCustomFirestore();

const shopChats = ref<{ lastMessageNickname: string; lastMessageText: string; lastMessageTimestamp: number }[]>([]); // Holds chat summaries
const selectedShopId = ref(""); // Current shop ID
const selectedChatId = ref(""); // Current chat ID
const showChatBox = ref(false); // Controls visibility of ChatBox
const userChats = ref<{ chatId: string; shopOwner: string; customer: string; message: { text: string; nickname: string; senderId: string; timestamp: number }; timestamp: Timestamp }[]>([]); // Holds chats initiated by the user

// fetch chats initiated by shop owner
const fetchChatsInitiated = async () => {
	try {
		const chatPromises = chatsInitiated.value.map(chat =>
			getChatByChatId(chat.chatFirebaseId),
		);
		const resolvedChats = await Promise.all(chatPromises);
		userChats.value = resolvedChats
			.filter((chat): chat is NonNullable<typeof chat> => chat !== null)
			.map(chat => ({
				shopOwner: chat.shopOwner,
				customer: chat.customer,
				message: {
					text: chat.messages[0].text,
					nickname: chat.messages[0].nickname,
					senderId: chat.messages[0].senderId,
					timestamp: chat.messages[0].timestamp,
				},
				timestamp: chat.messages[0].timestamp,
			}));
	}
	catch (error) {
		console.error("Error fetching initiated chats:", error);
	}
};

// Fetch chats addressed for the shop owner
const fetchShopChats = async () => {
	try {
		const shopId = shopsStore.userShop?._id || ""; // Ensure the shop ID is retrieved
		if (!shopId) {
			console.error("No shop ID available");
			return;
		}
		console.log("from messages page: Shop ID:", shopId); // Debugging log
		const chats = await getShopChats(shopId); // Fetch chats

		shopChats.value = chats.map(chat => ({
			...chat,
			lastMessageTimestamp: chat.lastMessageTimestamp.getTime(),
		})); // Assign fetched chats to the reactive variable
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
interface Chat {
	lastMessageNickname: string;
	lastMessageText: string;
	lastMessageTimestamp: number;
	shopId: string;
	chatFirebaseId: string;
}

const selectChat = (chat: Chat) => {
	console.log("Selected Chat:", chat); // Debugging log
	selectedShopId.value = shopsStore.userShop?._id || "";
	selectedChatId.value = chat.chatFirebaseId;
	showChatBox.value = true;
};

// Close the ChatBox
const closeChatBox = () => {
	showChatBox.value = false;
};

// Fetch chats on page load
onMounted(fetchShopChats);
onMounted(fetchChatsInitiated);
</script>

  <style scoped>
  .cursor-pointer {
	cursor: pointer;
  }
  </style>
