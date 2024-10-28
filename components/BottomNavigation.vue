<!-- BottomNavigation.vue -->
<template>
	<UHorizontalNavigation
		:links="links"
		class="border-b border-gray-200 dark:border-gray-800" />
</template>

<script setup lang="ts">
const links = [
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
	}, {
		label: "My Store",
		icon: "i-heroicons-store",
		to: "/my-store",
	}];
</script>
