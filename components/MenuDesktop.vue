<template>
	<div class="flex gap-5 ml-12">
		<NuxtLink
			v-for="link in links"
			:key="link.label"
			:to="link.to"
			class="menu-link"
			:class="{ active: $route.path === link.to }"
			@click.prevent="handleLinkClick(link)">
			<UIcon
				:name="link.icon"
				class="inline-block mr-2" />
			{{ link.label }}
		</NuxtLink>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const router = useRouter();

// Define dynamic links based on the login status
const links = computed(() => {
	if (userStore.loggedIn) {
		return [
			{ label: "Home", icon: "uil:home", to: "/" },
			{ label: "Messages", icon: "uil:envelope", to: "/messages" },
			{ label: "Wishlist", icon: "uil:heart", to: "/wishlist" },
			{ label: "Requests", icon: "uil:gift", to: "/requests" },
			{ label: "My Shop", icon: "uil:shop", to: "/shop" },
		];
	}
	else {
		return [
			{ label: "Home", icon: "uil:home", to: "/" },
			{ label: "Add Your Shop", icon: "uil:plus-circle", to: "/shop" },
		];
	}
});

// Redirects to login if the user is not logged in and clicks "Add Your Shop"
const handleLinkClick = (link) => {
	if (link.to === "/shop" && !userStore.loggedIn) {
		alert("You need to log in to add your shop!");
		router.push("/login");
	}
	else {
		router.push(link.to);
	}
};
</script>
