<template>
	<div class="flex flex-col min-h-screen bg-primary">
		<!-- Top Navbar -->
		<TopNavBar
			:open="menuOpen"
			@toggle-menu="toggleMenu" />

		<!-- Sidebar Menu -->
		<SidebarMenu
			v-show="menuOpen"
			@close="menuOpen = false" />

		<NuxtPage />
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
