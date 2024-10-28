<!-- SidebarMenu.vue -->
<template>
	<USidebar
		:open="open"
		class="bg-secondary"
		@close="$emit('close')">
		<UList>
			<UListItem @click="$emit('go-to', 'setup')">
				<UIcon
					name="settings"
					class="text-white" /> Setup
			</UListItem>
			<UListItem @click="$emit('go-to', 'profile')">
				<UIcon
					name="person"
					class="text-white" /> Profile
			</UListItem>
			<UListItem @click="$emit('go-to', 'help')">
				<UIcon
					name="help_circle"
					class="text-white" /> Help
			</UListItem>
		</UList>
	</USidebar>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
	open: Boolean,
});
</script>
