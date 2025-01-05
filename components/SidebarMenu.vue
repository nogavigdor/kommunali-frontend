<!-- SidebarMenu.vue -->
<template>
	<UVerticalNavigation
		:links="links"
		class="absolute z-40 bg-secondary min-h-screen w-72 p-12 pt-20 ">
		<template
			#default="{ link }">
			<span class="group-hover:text-primary relative md:text-2xl">{{ link.label }}</span>
		</template>
	</UVerticalNavigation>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const userHasShop = computed(() => userStore.hasShop);
const loggedIn = computed(() => userStore.loggedIn);

// define a close emit event to close the sidebar
const emit = defineEmits(["close"]);

function click() {
	emit("close");
}

const profile = {
	label: "Profile",
	avatar: {
		src: "https://avatars.githubusercontent.com/u/739984?v=4",
	},
	badge: 100,
	to: "/profile",
	click,
};

const faq = {
	label: "faq",
	icon: "i-heroicons-help-circle",
	to: "/faq",
	click,
};

const settings = {
	label: "settings",
	icon: "i-heroicons-settings",
	to: "/settings",
	click,
};

const shop = computed(() => ({
	label: userHasShop.value ? "My Shop" : "Add Shop",
	icon: userHasShop.value ? "i-heroicons-circle" : "i-heroicons-plus-circle",
	to: "/shop",
	click,
}));

// Sidebar menu links
const links = computed(() =>
	loggedIn.value
		? [profile, faq, settings, shop.value]
		: [faq],

);
</script>
