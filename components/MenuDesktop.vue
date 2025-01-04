<template>
	<div class="flex gap-5 ml-12">
		<NuxtLink
			v-for="link in links"
			:key="link.label"
			:to="link.to"
			class="menu-link"
			:class="{ active: $route.path === link.to }">
			<UIcon
				:name="link.icon"
				class="inline-block mr-2" />
			{{ link.label }}
		</NuxtLink>
	</div>
</template>

<script setup lang="ts">
const links = [
	{ label: "Home", icon: "uil:home", to: "/" },
	{ label: "Messages", icon: "uil:envelope", to: "/messages" },
	{ label: "Wishlist", icon: "uil:heart", to: "/wishlist" },
	{ label: "Requests", icon: "uil:gift", to: "/requests" },
	{ label: "My Shop", icon: "uil:shop", to: "/shop" },
];
</script>
