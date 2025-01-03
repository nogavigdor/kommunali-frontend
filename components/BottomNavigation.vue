<!-- BottomNavigation.vue -->
<template>
	<UHorizontalNavigation
		:links="links"
		class="fixed flex justify-center gap-12 bottom-0 bg-secondary border-b border-t border-gray-700 dark:border-gray-800 nav-label" />
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const userHasShop = computed(() => userStore.hasShop);

const links = computed(() =>
	[
		{
		//	label: "Home",
			icon: "uil:home",
			to: "/",
		},
		{
		//	label: "Messages",
			icon: "uil:envelope",
			to: "/messages",
		}, {
		//	label: "Wishlist",
			icon: "uil:heart",
			to: "/wishlist",
		}, {
		//		label: "Requests",
			icon: "uil-gift",
			to: "/requests",
		},

		{
			label: userHasShop.value ? "My Shop" : "Add Shop",
			icon: userHasShop.value ? "uil:shop" : "uil:plus-circle",
			to: "/shop",
		},

	]);
</script>
