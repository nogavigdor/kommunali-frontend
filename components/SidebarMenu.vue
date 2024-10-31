<!-- SidebarMenu.vue -->
<template>
	<UVerticalNavigation
		:links="links"
		class="absolute z-10 bg-secondary min-h-screen w-72 p-12 " />
</template>

<script setup lang="ts">
defineEmits(["close"]);
const links = [{
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
</script>
