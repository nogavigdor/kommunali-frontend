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
			<h2 class="text-lg font-semibold">
				My shop chats:
			</h2>
			<div
				v-for="chat in shopChats"
				:key="chat.lastMessageTimestamp"
				class="flex items-center justify-between p-4 rounded-lg bg-neutral-light shadow-soft hover:bg-neutral-dark hover:text-white transition-all cursor-pointer"
				@click="selectChat(myShopId!, chat.id)">
				<!-- Chat Summary -->
				<div>
					Last updated: {{ chat.messages[0].timestamp }}
				</div>
				<div>
					Chat with: {{ chat.customerNickname }}
				</div>

				<Icon
					name="iul:angle-right"
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
			v-if="chatsInitiated.length > 0"
			class="mt-4 space-y-2">
			<h2 class="text-lg font-semibold">
				My chats with other shops:
			</h2>
			<InitiatedChatRow
				v-for="chat in chatsInitiated"
				:key="chat.chatFirebaseId"
				:chat-id="chat.chatFirebaseId"
				:shop-id="chat.shopId"
				@click="selectChat(chat.shopId, chat.chatFirebaseId)" />
		</div>
		<!-- No Chats -->
		<p
			v-else
			class="text-gray-500 mt-4">
			No chats initiated by you.
		</p>

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
import type { Timestamp } from "firebase-admin/firestore";
import { collection } from "firebase/firestore";
import { useCustomFirestore } from "@/composables/useChat";
import { useShopsStore } from "@/stores/shops";
import { useUserStore } from "@/stores/user";

const shopsStore = useShopsStore();
const userStore = useUserStore();
const { db } = useCustomFirestore();

const chatsInitiated = computed(() => userStore.user.chatsInitiated);

// Composable to interact with Firestore
const { getChatByChatId } = useCustomFirestore();

const myShopId = computed(() => shopsStore.userShop?._id);
const selectedShopId = ref(""); // Current shop ID
const selectedChatId = ref(""); // Current chat ID
const showChatBox = ref(false); // Controls visibility of ChatBox
// will contain chats initiated by with other shops of other users
// const userChats = ref<{ chatId: string; shopOwnerNickname: string; customerNickname: string; message: { text: string; nickname: string; senderId: string; timestamp: timestamp } }[]>([]); // Holds chats initiated by the user
// will contain all the chats that that other users have initiated with the user's shop
const shopChats = useCollection(() => myShopId.value ? collection(db, "shopChats", myShopId.value, "chats") : null); // Holds all chats for user's shop

const userChats = ref<any>([]);

// fetch chats initiated by shop owner
const fetchChatsInitiated = async () => {
	try {
		console.log("from messages page: Chats Initiated:", chatsInitiated.value);

		// create the chatPromises array
		const chatPromises = chatsInitiated.value.map(chat =>
			getChatByChatId(chat.chatFirebaseId, chat.shopId),
		);

		// resolve all the promises
		userChats.value = await Promise.all(chatPromises);

		// console.log(resolvedChats);
		/* userChats.value = resolvedChats
			.filter(chat => chat !== null && chat.messages.length > 0)
			.map(chat => ({
				shopOwnerNickname: chat.shopOwnerNickname,
				customerNickname: chat.customerNickname,
				message: {
					text: chat.messages[chat.messages.length - 1].text,
					nickname: chat.messages[chat.messages.length - 1].nickname,
					senderId: chat.messages[chat.messages.length - 1].senderId,
					timestamp: chat.messages[chat.messages.length - 1].timestamp,
				},
				timestamp: chat.messages[0].timestamp,
			})); */
	}
	catch (error) {
		console.error("Error fetching initiated chats:", error);
	}
};

// Format timestamp into a readable date
const formatTimestamp = (timestamp) => {
	return format(new Date(timestamp), "dd/MM/yyyy HH:mm");
};

const selectChat = (shopId: string, chatId: string) => {
	console.log("Selected Chat:", chatId); // Debugging log
	selectedShopId.value = shopId;
	selectedChatId.value = chatId;
	showChatBox.value = true;
};

// Close the ChatBox
const closeChatBox = () => {
	showChatBox.value = false;
	selectedShopId.value = "";
	selectedChatId.value = "";
};

// Fetch chats on page load
onMounted(async () => {
	await until(() => shopsStore.userShop?._id).toBeTruthy(); // Wait until the shop ID is available
	await fetchChatsInitiated();
});
</script>

  <style scoped>
  .cursor-pointer {
	cursor: pointer;
  }
  </style>
