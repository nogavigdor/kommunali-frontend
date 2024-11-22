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
			<UserLocation
				v-if="showUserLocation"
				@change-address="changeAddressHandler" />
		</client-only>
		<!-- Map Container -->
		<MapContainer v-if="showMap" />

		<!-- Bottom Navigation -->
		<BottomNavigation @go-to="goTo" />
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";

const menuOpen = ref(false);
const toggleMenu = () => {
	menuOpen.value = !menuOpen.value;
};

const showMap = ref(false);

const showUserLocation = ref(true);

const isMobile = ref(false);

// Detect if the view is on mobile
const detectMobile = () => {
	isMobile.value = window.innerWidth <= 768;
};

// Import the current route
const route = useRoute(); // This line is crucial!

const router = useRouter();
const goTo = (path) => {
	router.push(path);
};

const userStore = useUserStore();
const changeAddressHandler = (mapboxAddressObject) => {
	console.log("The selected address is:", mapboxAddressObject);
	userStore.userLocation = mapboxAddressObject.features[0].geometry.coordinates;
	console.log("The user location is:", userStore.userLocation);
	showMap.value = true; // Trigger the map to be displayed
};

// Watch the route to determine if it's the homepage or another page
watch(
	() => route.path,
	(newPath) => {
		// If mobile and not on homepage, hide the map and user location
		if (isMobile.value && newPath !== "/") {
			showMap.value = false;
			showUserLocation.value = false;
		}
		else {
			showMap.value = true; // Show the map if on homepage
			showUserLocation.value = true; // Show the user location if on homepage
		}
	},
	{ immediate: true }, // Execute this logic on initial load as well
);
onMounted(() => {
	detectMobile();
	window.addEventListener("resize", detectMobile);
});
</script>
