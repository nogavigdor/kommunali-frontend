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

		<section
			v-if="shopChats.length > 0"
			class="mt-4 space-y-2">
			<h2 class="text-lg font-semibold">
				My shop chats:
			</h2>
			<div class="grid grid-cols-[1fr_2fr_2fr_0.5fr] font-bold p-3 bg-gray-200 rounded-lg border-b border-gray-300">
				<p>Chat with</p>
				<p>Last Message</p>
				<p>Last Updated</p>
				<p />
			</div>
			<div
				v-for="chat in shopChats"
				:key="chat.lastMessageTimestamp"
				class="grid grid-cols-[1fr_2fr_2fr_0.5fr] items-center p-4 rounded-lg bg-neutral-light shadow-soft border-b border-gray-300 hover:bg-neutral-dark hover:text-white transition-all cursor-pointer"
				@click="selectChat(myShopId!, chat.id)">
				<!-- Chat Summary -->
				<div>
					{{ chat.customerNickname }}
				</div>
				<div>
					{{ chat.messages[chat.messages.length-1].text }}
				</div>
				<div>
					{{ formatTimestamp(chat.messages[chat.messages.length-1].timestamp) }}
				</div>

				<Icon
					name="uil:angle-right"
					class="text-lg" />
			</div>
		</section>

		<!-- No Chats -->
		<p
			v-else
			class="text-gray-500 mt-4">
			No chats available.
		</p>
		<!-- Chats I've initiated with other shops -->
		<section
			v-if="chatsInitiated.length > 0"
			class="mt-8 space-y-4">
			<h2 class="text-lg font-semibold">
				My chats with other shops:
			</h2>
			<!-- Table Headers for Initiated Chats -->
			<div class="grid grid-cols-4 font-bold p-2 bg-gray-200 rounded-lg">
				<p>Chat with</p>
				<p>Last Message</p>
				<p>Last Updated</p>
				<p />
			</div>
			<InitiatedChatRow
				v-for="chat in chatsInitiated"
				:key="chat.chatFirebaseId"
				:chat-id="chat.chatFirebaseId"
				:shop-id="chat.shopId"
				class="grid grid-cols-4 items-center p-4 rounded-lg bg-neutral-light shadow-soft hover:bg-neutral-dark hover:text-white transition-all cursor-pointer"
				@click="selectChat(chat.shopId, chat.chatFirebaseId)" />
		</section>
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
import { collection, query, where, Timestamp } from "firebase/firestore";
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
const shopChats = useCollection(() => myShopId.value ? query(collection(db, "shopChats", myShopId.value, "chats"), where("shopOwner", "==", userStore.firebaseUserId)) : null); // Holds all chats for user's shop

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

// Format timestamp into a readable date and time (HH:mm - dd/MM/yyyy)
// Ensure the timestamp is properly handled and converted to a Date
const formatTimestamp = (timestamp?: any) => {
	if (!timestamp) return "Invalid date"; // If timestamp is missing
	if (timestamp instanceof Timestamp) {
		return format(timestamp.toDate(), "HH:mm - dd/MM/yyyy");
	}
	if (typeof timestamp === "number" || typeof timestamp === "string") {
		const date = new Date(timestamp);
		if (isNaN(date.getTime())) return "Invalid date"; // Ensure valid date conversion
		return format(date, "HH:mm - dd/MM/yyyy");
	}
	return "Invalid date";
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

  .grid-cols-[1fr_2fr_2fr_0.5fr] {
	display: grid;
	grid-template-columns: 1fr 2fr 2fr 0.5fr;
	gap: 1rem;
}

/* Prevent text overflow while still allowing it to be visible on hover */
.truncate {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	max-width: 100%;
}

p {
	margin: 0;
}
  </style>
