<!-- BottomNavigation.vue -->
<template>
	<UHorizontalNavigation
		:links="links"
		class="border-b border-gray-200 dark:border-gray-800" />
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const userHasShop = computed(() => userStore.hasShop);

const links = computed(() =>
	[
		{
			label: "Home",
			icon: "i-heroicons-home",
			to: "/",
		},
		{
			label: "Messages",
			icon: "i-heroicons-envelope",
			to: "/messages",
		}, {
			label: "wishlist",
			icon: "i-heroicons-wishlist",
			to: "/wishlist",
		}, {
			label: "requests",
			icon: "i-heroicons-clipboard-list",
			to: "/requests",
		},

		{
			label: userHasShop.value ? "My Shop" : "Add Shop",
			icon: userHasShop.value ? "i-heroicons-circle" : "i-heroicons-plus-circle",
			to: "/shop",
		},

	]);
</script>
