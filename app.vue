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
			<UserLocation @change-address="changeAddressHandler" />
		</client-only>
		<!-- Map Container -->
		<MapContainer v-if="showMap" />

		<!-- Bottom Navigation -->
		<BottomNavigation @go-to="goTo" />
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useShopsStore } from "@/stores/shops";

const menuOpen = ref(false);
const toggleMenu = () => {
	menuOpen.value = !menuOpen.value;
};

const showMap = ref(false);

const router = useRouter();
const goTo = (path) => {
	router.push(path);
};

const shopsStore = useShopsStore();
const changeAddressHandler = (mapboxAddressObject) => {
	console.log("The selected address is:", mapboxAddressObject);
	shopsStore.userLocation = mapboxAddressObject.features[0].geometry.coordinates;
	console.log("The user location is:", shopsStore.userLocation);
	showMap.value = true; // Trigger the map to be displayed
};
</script>
