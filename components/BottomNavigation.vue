<!-- BottomNavigation.vue -->
<template>
	<UHorizontalNavigation
		:links="links"
		class="fixed flex justify-center gap-12 bottom-0 bg-secondary border-b border-t border-gray-700 dark:border-gray-800 nav-label" />
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

// Define `links` with reactivity in mind
const links = computed(() => {
	return [
		{
			label: userStore.hasShop ? "My Shop" : "Add Shop",
			icon: userStore.hasShop ? "uil:shop" : "uil:plus-circle",
			to: "/shop",
		},
		// Show other links only when the user is logged in
		...(userStore.loggedIn
			? [
					{
						icon: "uil:home",
						to: "/",
					},
					{
						icon: "uil:envelope",
						to: "/messages",
					},
					{
						icon: "uil:heart",
						to: "/wishlist",
					},
					{
						icon: "uil:gift",
						to: "/requests",
					},
			  ]
			: []), // Empty array if not logged in
	];
});
</script>
