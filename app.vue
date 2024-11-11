<template>
	<div class="flex flex-col min-h-screen bg-primary">
		<!-- Top Navbar -->
		<TopNavBar
			:open="menuOpen"
			@toggle-menu="toggleMenu" />

		<!-- Sidebar Menu -->
		<transition
			enter-active-class="transition-transform duration-500 ease-in-out"
			leave-active-class="transition-transform duration-500 ease-in-out"
			enter-from-class="-translate-x-full"
			enter-to-class="translate-x-0"
			leave-from-class="translate-x-0"
			leave-to-class="-translate-x-full">
			<SidebarMenu
				v-if="menuOpen" />
		</transition>

		<NuxtPage />
		<client-only>
			<UserLocation />
		</client-only>
		<!-- Map Container -->
		<MapContainer />

		<!-- Bottom Navigation -->
		<BottomNavigation @go-to="goTo" />
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const menuOpen = ref(false);
const toggleMenu = () => {
	menuOpen.value = !menuOpen.value;
};

const router = useRouter();
const goTo = (path) => {
	router.push(path);
};
</script>
