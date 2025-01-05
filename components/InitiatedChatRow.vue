<template>
	<div
		class="grid grid-cols_1fr_2fr_2fr_0_5fr items-center p-4 rounded-lg bg-neutral-light shadow-soft border-b border-gray-300 hover:bg-neutral-dark hover:text-white transition-all cursor-pointer"
		@click="$emit('click')">
		<!-- Chat Summary -->
		<div class="truncate">
			<p>
				{{ chatDoc?.shopOwnerNickname }}
			</p>
		</div>
		<div class="truncate">
			<p>
				{{ chatDoc?.messages[chatDoc.messages.length - 1].text }}
			</p>
		</div>
		<div>
			<p>
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

<style scoped>
/* Grid Structure for Consistency */
.grid-cols_1fr_2fr_2fr_0_5fr {
	display: grid;
	grid-template-columns: 1fr 2fr 2fr 0.5fr;
	gap: 1rem;
}

/* Handle Long Text */
.truncate {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
p {
	margin: 0;
}
</style>
