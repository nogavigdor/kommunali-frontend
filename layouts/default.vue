<template>
	<div class="flex flex-col min-h-screen bg-primary">
		<!-- Top Navbar -->
		<TopNavBar
			:open="menuOpen"
			@toggle-menu="toggleMenu" />
		<!-- @highlight-shops="mapRef?.value?.highlightMarkers && mapRef.value.highlightMarkers()" / -->

		<!-- Sidebar Menu -->
		<transition
			enter-active-class="transition-transform duration-500 ease-in-out"
			leave-active-class="transition-transform duration-500 ease-in-out"
			enter-from-class="-translate-x-full"
			enter-to-class="translate-x-0"
			leave-from-class="translate-x-0"
			leave-to-class="-translate-x-full">
			<SidebarMenu
				v-if="menuOpen"
				@close="menuOpen = false" />
		</transition>
		<!-- General Feedback Message Component -->
		<FeedbackMessage />
		<client-only>
			<UserLocation
				v-if="showUserLocation"
				ref="userLocationRef"
				@change-address="changeAddressHandler" />
		</client-only>
		<!-- Sliding Page Content -->
		<NuxtPage />
		<!-- Map Container -->
		<MapContainer
			ref="map"
			:is-hidden="!showMap" />

		<!-- Bottom Navigation -->
		<BottomNavigation
			v-if="isMobile"
			@go-to="goTo" />
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { useFirebaseAuth } from "vuefire";
import { storeToRefs } from "pinia";
import type { IShop } from "./types/shop";
import { useUserStore } from "@/stores/user";
import { useShopsStore } from "@/stores/shops";
import type { IUser } from "@/types/user"; // Add reference to UserLocation component

const isSliding = ref(false);

const menuOpen = ref(false);
const toggleMenu = () => {
	menuOpen.value = !menuOpen.value;
};

const shopsStore = useShopsStore();

const { shops } = storeToRefs(shopsStore);

// Watch for changes in the shops array
// for example, when a user creates a shop, show the map
// watch(shops, (newShops, oldShops) => {
// 	if (newShops.length > oldShops.length) {
// 		console.log("A new shop was added. Making the map visible...");
// 		if (mapRef.value) {
// 			mapRef.value.centerMap(newShops[newShops.length - 1].location.coordinates); // Center the map on the new shop's coordinates
// 		}
// 		showMap.value = true; // Show the map
// 	}
// });

const auth = useFirebaseAuth()!;

const showMap = ref(false);

const isMobile = ref(false);
// Export the showMap and isMobile constants to be used in other components
// along the components tree
provide("showMap", showMap);

provide("isMobile", isMobile);

const showUserLocation = ref(true);

const userLocationRef = ref(null);
const mapRef = ref<MapContainerInstance | null>(null); // Add reference to Map component

const showPage = ref(true);

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
const { user, userLocation, loggedIn, firebaseUserId, hasShop, shopIds } = storeToRefs(userStore);
const changeAddressHandler = (mapboxAddressObject) => {
	console.log("The selected address is:", mapboxAddressObject);
	userStore.userLocation = mapboxAddressObject.features[0].geometry.coordinates;
	console.log("The user location is:", userStore.userLocation);
	showMap.value = true; // Trigger the map to be displayed
	showPage.value = false; // Hide the homepage content
};

// Watch the route to determine if it's the homepage or another page
watch(
	() => route.path,
	(newPath) => {
		// If mobile and not on homepage, hide the map and user location
		if (isMobile.value && newPath !== "/") {
			showMap.value = false;
			showUserLocation.value = false;
			showPage.value = true;
			isSliding.value = true;
		}
		else {
			showMap.value = true; // Show the map if on homepage
			showUserLocation.value = true; // Show the user location if on homepage
			showPage.value = true; // Hide the homepage content if on another page
		}
	},
);
onMounted(() => {
	// check if user still is logged in firbase authentication and update the user store accordingly
	onAuthStateChanged(auth, async (firebaseUser) => {
		if (firebaseUser) {
			console.log("User detected on page load:", firebaseUser);
			loggedIn.value = true;
			firebaseUserId.value = firebaseUser.uid;
			try {
				const userResponse: IUser = await userStore.getUser(firebaseUserId.value);
				user.value = userResponse;
				userLocation.value = userResponse.lastCoordinates;
				showMap.value = true;

				userStore.updateShopData(userResponse);
			}
			catch (error) {
				console.error("Error fetching user after refresh:", error);
			}
		}
		else {
			loggedIn.value = false;
		}
	});
	detectMobile();
	window.addEventListener("resize", detectMobile);

	// Function to scroll to the input in UserLocation
	const scrollToUserLocationInput = () => {
		if (userLocationRef.value) {
			userLocationRef.value.scrollToInput(); // Call the function from UserLocation
		}
	};
});
</script>

<style>
.page-enter-active, .page-leave-active {
	transition: transform 0.5s;
}
.page-enter-from, .page-leave-to {
	transform: translateX(-100%);
}
</style>
