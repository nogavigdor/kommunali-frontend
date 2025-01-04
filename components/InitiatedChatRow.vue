<template>
	<div
		class="flex items-center justify-between p-4 rounded-lg bg-neutral-light shadow-soft hover:bg-neutral-dark hover:text-white transition-all cursor-pointer"
		@click="$emit('click')">
		<!-- Chat Summary -->
		<p class="font-semibold">
			Shop owner: {{ chatDoc?.shopOwnerNickname }}
		</p>
		<p class="font-semibold">
			Last message {{ chatDoc?.messages[chatDoc.messages.length - 1].text }}
		</p>
		<div>
			<p class="font-semibold">
				{{ formatTimestamp(chatDoc?.messages[chatDoc.messages.length - 1].timestamp) }}
			</p>
		</div>
		<Icon
			name="uil:angle-right"
			class="text-lg" />
	</div>
</template>

<script setup lang="ts">
import { doc, Timestamp } from "firebase/firestore";
import { format } from "date-fns";

const props = defineProps<{ chatId: string; shopId: string }>();

defineEmits(["click"]);

const { db } = useCustomFirestore();
const chatDoc = useDocument(() => props.chatId && props.shopId ? doc(db, `shopChats/${props.shopId}/chats/${props.chatId}`) : null);

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
</script>
