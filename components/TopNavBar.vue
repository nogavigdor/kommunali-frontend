<!-- TopNavbar.vue -->
<template>
	<nav class="bg-primary text-white relative">
		<div class="flex justify-between items-center w-full px-4">
			<!-- Left Side - Menu Icon -->
			<button
				class="ml-4  z-50"
				@click="$emit('toggle-menu')">
				<UIcon
					:name="open ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
					class="text-xl" />
			</button>

			<!-- Middle - Desktop Menu (Only for Desktop) -->
			<div
				class="hidden flex-grow md:flex items-center">
				<MenuDesktop />
			</div>
			<SearchBarTypesense />

			<!-- Right Side - Account Icon -->
			<div class="relative">
				<button @click="toggleAccountMenu">
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
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";

defineProps({
	open: Boolean,
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
