<!-- TopNavbar.vue -->
<template>
	<div class="top-navbar-height pr-8">
		<nav class="bg-primary text-white relative">
			<div class="flex justify-between items-center w-full px-4 pr-5 pl-5 pt-5">
				<!-- Left Side - Menu Icon -->
				<button
					class="ml-4  z-50 "
					@click="$emit('toggle-menu')">
					<Icon
						:name="open ? 'uil:times-circle' : 'uil:bars'"
						:class="open ? 'text-text' : 'text-white'"
						class="text-2xl font-bold = md:text-4xl" />
				</button>

				<!-- Middle - Desktop Menu (Only for Desktop) -->
				<div
					class="hidden flex-grow md:flex items-center">
					<MenuDesktop />
				</div>

				<!-- Right Side - Account Icon -->
				<div class="relative">
					<button @click="toggleAccountMenu">
						{{ userStore.user?.nickname }}
						<Icon
							name="uil:user"
							class="text-2xl" />
					</button>
					<transition
						enter-active-class="transition duration-200"
						leave-active-class="transition duration-200"
						enter-from-class="opacity-0 scale-95"
						enter-to-class="opacity-100 scale-100"
						leave-from-class="opacity-100 scale-100"
						leave-to-class="opacity-0 scale-95">
						<div
							v-if="showAccountMenu"
							class="absolute right-0 mt-2 bg-white text-black shadow-md rounded-lg p-4 z-10">
							<ul>
								<li v-if="!userLoggedIn">
									<button
										class="block w-full text-left"
										@click="goToLoginPage">
										Login
									</button>
								</li>
								<li v-if="!userLoggedIn">
									<button
										class="block w-full text-left"
										@click="goToRegisterPage">
										Register
									</button>
								</li>
								<li v-if="userLoggedIn">
									<button
										class="block w-full text-left"
										@click="userLogOut">
										Logout
									</button>
								</li>
							</ul>
						</div>
					</transition>
				</div>
			</div>
		</nav>
		<div class="flex pb-4  justify-between items-center ">
			<NuxtLink
				to="/">
				<img
					src="/assets/images/logo.png"
					alt="Kommunali Logo"
					class="w-24 md:w-48">
			</NuxtLink>
			<div
				ref="userLocationRef"
				class="flex justify-center items-center gap-4 w-full">
				<client-only>
					<UserLocation
						v-if="
							showUserLocation" />
				</client-only>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import { useUserStore } from "@/stores/user";

defineProps({
	open: Boolean,
	showUserLocation: Boolean,
});

const showAccountMenu = ref(false);

const _emit = defineEmits(["toggle-menu"]);

const router = useRouter();

const userStore = useUserStore();

const toggleAccountMenu = () => {
	showAccountMenu.value = !showAccountMenu.value;
};

const userLoggedIn = computed(() => userStore.loggedIn);

const userLogOut = () => {
	userStore.logOutUser();
};

// Function to navigate to the registration page
const goToRegisterPage = () => {
	router.push("/register");
};

const goToLoginPage = () => {
	router.push("/login");
};
</script>

<style scoped>
.top-navbar-height {
	height: var(--topnav-height);
}
</style>
