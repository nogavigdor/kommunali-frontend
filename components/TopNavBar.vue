<!-- TopNavbar.vue -->
<template>
	<nav class="bg-primary text-white">
		<div class="flex justify-between items-center w-full">
			<!-- Left Side - Menu Icon -->
			<button
				class="ml-4"
				@click="$emit('toggle-menu')">
				<UIcon
					:name="open?'i-heroicons-x-mark':'i-heroicons-bars-3'"
					class="absolute text-xl z-20 top-5 left-5 text-white" />
			</button>

			<!-- Register Button  -->
			<div
				v-if="!userLoggedIn"
				class="flex-grow text-center">
				<button
					class="btn-secondary"
					@click="goToRegisterPage">
					Register
				</button>
			</div>
			<!-- Login Button  -->
			<div
				v-if="!userLoggedIn"
				class="flex-grow text-center">
				<button
					class="btn-secondary"
					@click="goToLoginPage">
					Login
				</button>
			</div>
			<div
				v-else
				class="flex-grow text-center">
				<button
					class="btn-secondary"
					@click="userLogOut">
					Logout
				</button>
			</div>

			<!-- Search Bar -->
			<ClientOnly>
				<SearchBar @highlight-shops="highlightShopsOnMap" />
			</ClientOnly>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";

defineProps({
	open: Boolean,
});
const emit = defineEmits(["toggle-menu", "highlight-shops"]);

const router = useRouter();

const userStore = useUserStore();

const userLoggedIn = computed(() => userStore.loggedIn);

const userLogOut = () => {
	userStore.logOutUser();
};

// Function to navigate to the registration page
const goToRegisterPage = () => {
	router.push("/registration");
};

const goToLoginPage = () => {
	router.push("/login");
};

const highlightShopsOnMap = (shopIds: string[]) => {
	emit("highlight-shops", shopIds); // Pass shop IDs to the App
};
</script>
