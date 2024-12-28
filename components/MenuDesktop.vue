<template>
	<div class="flex gap-4">
		<a
			v-for="link in links"
			:key="link.label"
			:href="link.to"
			class="text-white hover:text-gray-300">
			<UIcon
				:name="link.icon"
				class="inline-block mr-2" />
			{{ link.label }}
		</a>
	</div>
</template>

<script setup lang="ts">
const links = [
	{ label: "Home", icon: "i-heroicons-home", to: "/" },
	{ label: "Messages", icon: "i-heroicons-envelope", to: "/messages" },
	{ label: "Wishlist", icon: "i-heroicons-wishlist", to: "/wishlist" },
	{ label: "Requests", icon: "i-heroicons-clipboard-list", to: "/requests" },
	{ label: "Shop", icon: "i-heroicons-shop", to: "/shop" },
];
</script>
