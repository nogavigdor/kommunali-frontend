<!-- SidebarMenu.vue -->
<template>
	<UVerticalNavigation
		:links="links"
		class="absolute z-10 bg-secondary min-h-screen w-72 p-12 ">
		<template #default="{ link }">
			<span class="group-hover:text-primary relative">{{ link.label }}</span>
		</template>
	</UVerticalNavigation>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const userHasShop = computed(() => userStore.hasShop);

// define a close emit event to close the sidebar
defineEmits(["close"]);

// Sidebar menu links
const links = computed(() => {
	const baseLinks = [{
		label: "Profile",
		avatar: {
			src: "https://avatars.githubusercontent.com/u/739984?v=4",
		},
		badge: 100,
	}, {
		label: "settings",
		icon: "i-heroicons-settings",
		to: "/settings",
	}, {
		label: "help",
		icon: "i-heroicons-help-circle",
		to: "/help",

	}];

	// Add shop link if user has no shop
	if (!userHasShop.value && userStore.loggedIn) {
		baseLinks.push({
			label: "Add Shop",
			icon: "i-heroicons-plus-circle",
			to: "/shop",
		});
	}

	return baseLinks;
});
</script>
