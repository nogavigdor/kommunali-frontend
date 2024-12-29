<!-- MapContainer.vue -->
<template>
	<!-- Shop Details Overlay -->
	<ShopDetails
		v-if="showShopDetails"
		v-show="!isHidden"
		:selected-shop-id="selectedShopId || ''"
		:style="shopDetailsStyle || {}"
		@close="
			closeShopDetails" />
	<div
		v-show="!isHidden"
		id="map"
		class="relative flex-grow h-full w-full" />
</template>

<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import { storeToRefs } from "pinia";
import { useShopsStore } from "@/stores/shops";
import { useUserStore } from "@/stores/user";
import type { IShop } from "@/types/shop";
import "mapbox-gl/dist/mapbox-gl.css";
import { update } from "firebase/database";
// import markerImage from "@/assets/images/marker-image.png";

defineProps({
	isHidden: Boolean,
});

defineEmits(["highlight-shops"]);

const shopsStore = useShopsStore();
const userStore = useUserStore();
// const { shops } = useShopsStore(); // non-reactive
const { shops } = storeToRefs(shopsStore);
const { userLocation } = storeToRefs(userStore);
const user = computed(() => userStore.user);
const userLoggedIn = computed(() => userStore.loggedIn);

let currentMarkers: mapboxgl.Marker[] = [];

const showShopDetails = ref(false);

const shopDetailsStyle = ref({ top: "0", left: "0" });

const selectedShopId = ref<string | null>(null);

const highlightedShops = computed(() => shopsStore.highlightedShops);

const mitHusImage = new URL("@/assets/images/mit-hus.svg", import.meta.url).href;
const husImage = new URL("@/assets/images/hus.svg", import.meta.url).href;
const highlightedHusImage = new URL("@/assets/images/highlighted-hus.svg", import.meta.url).href;

// const highlightedShops = ref<string[]>([]);

// highlight shops on the map - used for highlighting shops which has products that match the search query
// const highlighShops = (shopIds: string[]) => {
// highlightedShops.value = shopIds; // Store highlighted shop IDs
// updateMarkers(shops.value); // Re-render markers
// };

// watch `shops` so it will be up to date.
watch(shops, (newShops) => {
	console.log("Shops updated:", newShops);
	if (mapRef.value) {
		updateMarkers(newShops); // Update the map markers whenever `shops` changes
	}
});

watch(highlightedShops, (newShops) => {
	console.log("Highlighted shops updated:", newShops);
	if (mapRef.value) {
		updateMarkers(shops.value); // Update the map markers whenever `highlightedShops` changes
	}
});

console.log("The shops are:", shops);
const config = useRuntimeConfig() as unknown as { public: { mapboxApiKey: string } };

const mapRef = ref<mapboxgl.Map | null>(null) as Ref<mapboxgl.Map | null>;

// Watch for changes in userLocation and update the map center
watch(userLocation, async (newLocation) => {
	console.log("userLocation watcher");
	console.log("New user location:", newLocation);
	if (mapRef.value) {
		mapRef.value.setCenter(newLocation);
		console.log("userLocation updated, fetching new shops");
		await updateShopsOnMap(); // Update shops for the new location
	}
});

function updateShopDisplayStyle(shop: IShop) {
	// Calculate the position of the clicked marker on the screen
	const mapBoxPoint = mapRef.value?.project(shop.location.coordinates);
	if (mapBoxPoint) {
		// Set the shop details overlay position to be near the marker position
		shopDetailsStyle.value = {
			top: `${mapBoxPoint.y}px`,
			left: `${mapBoxPoint.x}px`,
		};
	}
}

function updateMarkers(shops: IShop[]) {
	// Remove current markers from the map
	currentMarkers.forEach(marker => marker.remove());
	currentMarkers = []; // Clear the array after removing
	// Display shops on the map as markers
	shops.forEach((shop) => {
		console.log("Shop to be presented on the map:", shop);
		if (!shop.location || !shop.location.coordinates) {
			console.warn("Shop location is invalid:", shop);
			return;
		}

		const el = document.createElement("div");
		el.className = "marker";

		// Checks if the shop belongs to the logged in user
		// shopsStore.getUserShop(user.value?.stores[0]?._id ?? "");
		const isUserShop = userStore.shopIds.includes(shop._id) ?? false;
		console.log("Is user shop:", isUserShop);
		// console.log(`User shop ID: ${user.value?.storesId}, Shop ID: ${shop._id}`);

		if (isUserShop) {
			// replaces the marker svg for the logged-in user's shop
			el.style.backgroundImage = `url(${mitHusImage})`;
		}
		else {
			// Default marker svg
			el.style.backgroundImage = `url(${highlightedShops.value.includes(shop._id) ? highlightedHusImage : husImage})`;
			el.style.width = "30px";
		}

		// Apply the styles using Object.assign
		/*
		el.className = "marker mapbox-marker";
		el.style.backgroundColor = "#7B1FA2";
		el.style.width = "50px";
		el.style.height = "50px";
		el.style.borderRadius = "50%";
		el.style.cursor = "pointer";
		el.style.border = "2px solid black";
		el.style.zIndex = "9999";
		const markerStyle = {
			backgroundImage: `url(${markerImage})`,
			backgroundSize: "cover",
			//	backgroundColor: "#7B1FA2",
			width: "30px",
			height: "30px",
			// borderRadius: "50%",
			cursor: "pointer",
			// border: "2px solid black",
			zIndex: "9999",
		};
		// applying the marker styles to the marker element
		Object.assign(el.style, markerStyle); */

		// Handle marker click event
		el.addEventListener("click", () => {
			console.log("Shop clicked:", shop);
			showShopDetails.value = true;

			selectedShopId.value = shop._id; // Set the selected shop
			console.log("Selected shop ID:", selectedShopId.value);

			updateShopDisplayStyle(shop); // Update the shop details overlay position
		});

		// Create a popup for additional shop info
		// const popup = new mapboxgl.Popup({ offset: 25 }).setText(
		//	`${shop.name} - ${shop.address.street} ${shop.address.houseNumber}, ${shop.address.city}`,
		// );

		// console.log("Popup created for marker: ", popup);

		// Create a marker for each shop
		const marker = new mapboxgl.Marker(el)
			.setLngLat(shop.location.coordinates)
			// .setPopup(popup) // Attach popup to marker
			.addTo(mapRef.value as mapboxgl.Map);
		//	el.className = "marker mapbox-marker";
		console.log("Created marker:", marker);

		currentMarkers.push(marker); // Keep track of the markers

		console.log("The current markers are:", currentMarkers);
	});
}

// Function to update the shops based on the current map bounds
const updateShopsOnMap = async () => {
	console.log("updateShopsOnMap called");
	if (!mapRef.value) return;

	// Get the current bounds of the map
	const bounds = mapRef.value.getBounds();
	if (!bounds) return;
	const bottomLeft: [number, number] = [bounds.getWest() ?? 0, bounds.getSouth() ?? 0];
	const topRight: [number, number] = [bounds.getEast() ?? 0, bounds.getNorth() ?? 0];

	// Fetch nearby shops based on the current bounds
	await shopsStore.getShops({
		bottomLeft,
		topRight,
	});

	console.log("Shops to be presented on the map outside foreach:", shops);

	// Remove any existing markers
	document.querySelectorAll(".marker").forEach(marker => marker.remove());

	// Display shops on the map as markers
	updateMarkers(shops.value as IShop[]);
};

// Initialize Mapbox on component mount
onMounted(() => {
	mapboxgl.accessToken = config.public.mapboxApiKey;
	console.log("onMounted called - initializing map");

	// Initialize the map instance with default coordinates or user's last known coordinates
	const initialCoordinates = user.value?.lastCoordinates || [12.568337, 55.676098]; // Default to Copenhagen
	// Initialize the map instance
	if (!mapRef.value) {
		console.log("Creating new Map instance");
		mapRef.value = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/light-v11",
			center: userLocation.value || [12.568337, 55.676098], // Default location
			zoom: 12,
			minZoom: 12, // Prevent zooming out too much (adjust to suit your needs)
			maxZoom: 18, // Allow zooming in closely
			maxBounds: [
				[7.5, 54.5], // Southwest corner of Denmark
				[15.5, 58], // Northeast corner of Denmark
			],
			trackResize: true,
		});

		// Call update markers after the map is loaded
		mapRef.value.on("load", async () => {
			await updateShopsOnMap();
			setupMapListeners(); // Attach listeners for move/zoom
			mapRef.value?.resize(); // Resize the map to fit the container
		});
	}
});

// add event listeners for map move/zoom events
const setupMapListeners = () => {
	if (mapRef.value) {
		// Attach event listeners to update the shops when the map is moved or zoomed
		mapRef.value?.on("moveend", async () => {
			console.log("Map moved, updating shops on map");
			await updateShopsOnMap();
			const { lng, lat } = mapRef.value!.getCenter();
			// Update the user's last known coordinates if they are logged in
			if (userLoggedIn.value)
				console.log("Updating user last coordinates:", lng, lat);
			userStore.updateUser({ lastCoordinates: [lng, lat] });
		});

		mapRef.value?.on("zoomend", async () => {
			console.log("Map zoomed, updating shops on map");
			await updateShopsOnMap();
		});

		// Attach event listeners to keep shop details aligned with marker position
		mapRef.value.on("move", updateShopDetailsPosition);
		mapRef.value.on("zoom", updateShopDetailsPosition);
	}
};

// Function to keep the ShopDetails window updated with marker position
const updateShopDetailsPosition = () => {
	if (!showShopDetails.value || !selectedShopId.value) return;

	const shop = shops.value.find(shop => shop._id === selectedShopId.value);

	if (shop) {
		updateShopDisplayStyle(shop);
	}
};

// Close shop details
const closeShopDetails = () => {
	showShopDetails.value = false;
	selectedShopId.value = null;
};

// Center the map on a specific set of coordinates
function centerMap(coordinates: [number, number]) {
	if (mapRef.value) {
		console.log("Centering map on:", coordinates);
		mapRef.value.setCenter(coordinates); // Update the map's center
	}
}
// Expose the centerMap function to the parent component
defineExpose({ centerMap });
</script>

<style>
.marker.mapboxgl-marker {
	background-image: url('@/assets/images/hus.svg');
  background-size: cover;
  width: 30px;
  height: 30px;
  cursor: pointer;
	z-index: 3;
}
</style>
