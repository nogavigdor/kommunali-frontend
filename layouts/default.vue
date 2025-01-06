<template>
	<div class="flex flex-col min-h-screen bg-primary">
		<!-- Top Navbar -->
		<TopNavBar
			:open="menuOpen"
			@navbar-height="updateNavbarHeight"
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
		<!-- Page Content and Tip Section -->
		<div
			class="flex-grow flex transition-all duration-500"
			:style="{ paddingTop: navbarHeight }">
			<!-- Main Page Content (50% Width) -->
			<div class="w-1/2 flex-grow">
				<NuxtPage />
			</div>

			<!-- Tip Section (Conditional) -->

			<!-- Tip Section (More Prominent with Blinking Arrow) -->
			<transition
				name="fade-slide"
				mode="out-in">
				<div
					v-if="!isMobile && !showMap && route.path !== '/'"
					class="w-1/2 flex flex-col justify-center items-center bg-accent-dark text-black relative p-12 border-l-4 border-secondary-dark">
					<!-- Tip Box with Enlarged Text -->
					<div class="tip-box relative p-10 bg-white rounded-2xl shadow-2xl border-2 border-secondary text-center">
						<i class="fas fa-lightbulb text-6xl text-yellow-400 animate-bounce mb-6" />
						<p class="text-2xl font-bold text-secondary-dark">
							💡 Tip for this page:
						</p>
						<p class="mt-4 text-xl font-semibold text-gray-700 leading-relaxed">
							{{ pageTip }}
						</p>
					</div>
				</div>
			</transition>
		</div>
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

const userStore = useUserStore();
const { user, userLocation, loggedIn, firebaseUserId, hasShop, shopIds } = storeToRefs(userStore);
const isSliding = ref(false);
const pageTip = ref("");

const menuOpen = ref(false);
const toggleMenu = () => {
	menuOpen.value = !menuOpen.value;
};
const navbarHeight = ref("0px");
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

// Watch the user location and show the map if the user has a location
watch(userLocation, (newLocation) => {
	if (newLocation[0] !== 0 && newLocation[1] !== 0) {
		showMap.value = true;
	}
	// if the user location is 0,0 and the user is not on the homepage, hide the map
	// and navigate to the homepage
	else {
		showMap.value = false;
	}
});

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
			isSliding.value = true;
		}
		else if (!isMobile.value && userLocation.value[0] !== 0 && userLocation.value[1] !== 0) {
			showMap.value = true; // Show the map if on homepage
			showUserLocation.value = true; // Show the user location if on homepage
		}
		else {
			showMap.value = false;
			showUserLocation.value = true;
		}
	},
);

// Captures emitted navbar height
const updateNavbarHeight = (height: string) => {
	navbarHeight.value = height;
};

// Dynamically set page-specific tips
const updatePageTip = () => {
	switch (route.path) {
		case "/about":
			pageTip.value = "Discover our mission to promote sustainability and community connection.";
			break;
		case "/shop":
			pageTip.value = "Click on 'Add Shop', Choose your shop title, add a short description, and most importantly, enter your shop location. Once you're done, you'll be able to see your shop - marked as a red house on the map. You are welcome to start adding products!";
			break;
		case "/faq":
			pageTip.value = "Check out our FAQ for help with using Kommunali. If you don't find what you need, feel free to contact us!";
			break;
		case "/messages":
			pageTip.value = "Here you can see all the messages from other users who have visited your shop, as well as all the messages that you have sent to other shop owners.";
			break;
		case "/wishlist":
			pageTip.value = "This page is under construction. Stay tuned for updates!";
			break;
		case "/requests":
			pageTip.value = "This page is under construction. Stay tuned for updates!";
			break;
		case "/profile":
			pageTip.value = "This page is under construction. Stay tuned for updates!";
			break;
		default:
			pageTip.value = "Explore second-hand treasures while staying connected with your community!";
	}
};

// Watch for route changes and update the tip accordingly
watch(
	() => route.path,
	() => {
		updatePageTip();
	},
);

// Initialize the tip on component mount
updatePageTip();
onMounted(() => {
	// check if user still is logged in firbase authentication and update the user store accordingly
	onAuthStateChanged(auth, async (firebaseUser) => {
		if (firebaseUser) {
			console.log("User detected on page load:", firebaseUser);
			loggedIn.value = true;
			firebaseUserId.value = firebaseUser.uid;
			try {
				const userResponse: IUser = await userStore.getUser(firebaseUserId.value);
				userStore.loadUser(userResponse);
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

/* Fade Slide Animation */
.fade-slide-enter-active, .fade-slide-leave-active {
    transition: all 0.5s ease-in-out;
}
.fade-slide-enter-from, .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
.fade-slide-enter-to, .fade-slide-leave-from {
    opacity: 1;
    transform: translateX(0);
}

/* Blinking Arrow Animation */
.blinking-arrow {
    animation: blinkArrow 1.2s ease-in-out infinite;
}
@keyframes blinkArrow {
    0%, 100% {
        opacity: 1;
        transform: translateX(0);
    }
    50% {
        opacity: 0.5;
        transform: translateX(-10px);
    }
}

/* Lightbulb Bounce Effect */
.animate-bounce {
    animation: bounce 1.5s infinite;
}
@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

/* Tip Box Styling */
.tip-box {
    max-width: 500px;
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
</style>
