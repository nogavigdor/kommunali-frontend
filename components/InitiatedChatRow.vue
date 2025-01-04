<template>
	<div
		class="flex items-center justify-between p-4 rounded-lg bg-neutral-light shadow-soft hover:bg-neutral-dark hover:text-white transition-all cursor-pointer"
		@click="$emit('click')">
		<!-- Chat Summary -->
		<div>
			<p class="font-semibold">
				Me: {{ new Date(chatDoc.messages[chatDoc.messages.length - 1].timestamp) }}
			</p>
			<p class="font-semibold">
				Shop owner: {{ chatDoc.shopOwnerNickname }}
			</p>
		</div>
		<Icon
			name="uil:angle-right"
			class="text-lg" />
	</div>
</template>

<script setup lang="ts">
import { doc } from "firebase/firestore";

const props = defineProps<{ chatId: string; shopId: string }>();

defineEmits(["click"]);

const { db } = useCustomFirestore();
const chatDoc = useDocument(() => props.chatId && props.shopId ? doc(db, `shopChats/${props.shopId}/chats/${props.chatId}`) : null);
</script>
