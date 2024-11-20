<!-- MapContainer.vue -->
<template>
	<div
		id="map"
		class="flex-grow h-full w-full">
		<!-- Shop Details Overlay -->
		<ShopDetails
			v-if="showShopDetails"
			:shop="selectedShop || {}"
			:style="shopDetailsStyle"
			@close="
				closeShopDetails" />
	</div>
</template>

<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import { storeToRefs } from "pinia";
import { useShopsStore } from "@/stores/shops";
import type { IShop } from "@/types/shop";
import "mapbox-gl/dist/mapbox-gl.css";
import markerImage from "@/assets/images/marker-image.png";

const shopsStore = useShopsStore();
// const { shops } = useShopsStore(); // non-reactive
const { shops, userLocation } = storeToRefs(shopsStore);

let currentMarkers: mapboxgl.Marker[] = [];

const showShopDetails = ref(false);

const shopDetailsStyle = ref({ top: "0", left: "0" });

const selectedShop = ref<IShop | null>(null);

// Now you can watch `shops` or use it in your template, and it will stay up-to-date.
watch(shops, (newShops) => {
	console.log("Shops updated:", newShops);
	if (mapRef.value) {
		updateMarkers(newShops); // Update the map markers whenever `shops` changes
	}
});

console.log("The shops are:", shops);
const config = useRuntimeConfig() as unknown as { public: { mapboxApiKey: string } };

const mapRef = ref<mapboxgl.Map | null>(null) as Ref<mapboxgl.Map | null>;

// Watch for changes in userLocation and update the map center
watch(userLocation, async (newLocation) => {
	console.log("userLocation watcher");
	if (mapRef.value) {
		mapRef.value.setCenter(newLocation);
		console.log("userLocation updated, fetching new shops");
		await updateShopsOnMap(); // Update shops for the new location
	}
});

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

		// Apply the styles using Object.assign
		/*
		el.className = "marker mapbox-marker";
		el.style.backgroundColor = "#7B1FA2";
		el.style.width = "50px";
		el.style.height = "50px";
		el.style.borderRadius = "50%";
		el.style.cursor = "pointer";
		el.style.border = "2px solid black";
		el.style.zIndex = "9999"; */
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
		Object.assign(el.style, markerStyle);

		// Handle marker click event
		el.addEventListener("click", () => {
			console.log("Shop clicked:", shop);
			showShopDetails.value = true;

			selectedShop.value = shop; // Set the selected shop

			// Calculate the position of the clicked marker on the screen
			const mapBoxPoint = mapRef.value?.project(shop.location.coordinates);
			if (mapBoxPoint) {
				// Set the shop details overlay position to be near the marker position
				shopDetailsStyle.value = {
					top: `${mapBoxPoint.y}px`,
					left: `${mapBoxPoint.x}px`,
				};
			}
		});

		// Create a popup for additional shop info
		const popup = new mapboxgl.Popup({ offset: 25 }).setText(
			`${shop.name} - ${shop.address.street} ${shop.address.houseNumber}, ${shop.address.city}`,
		);

		console.log("Popup created for marker: ", popup);

		// Create a marker for each shop
		const marker = new mapboxgl.Marker(el)
			.setLngLat(shop.location.coordinates)
			.setPopup(popup) // Attach popup to marker
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

	// Initialize the map instance
	if (!mapRef.value) {
		console.log("Creating new Map instance");
		mapRef.value = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/light-v11",
			center: shopsStore.userLocation || [12.568337, 55.676098], // Default location
			zoom: 12,
			minZoom: 12, // Prevent zooming out too much (adjust to suit your needs)
			maxZoom: 18, // Allow zooming in closely
			maxBounds: [
				[7.5, 54.5], // Southwest corner of Denmark
				[15.5, 58], // Northeast corner of Denmark
			],
		});

		// Call update markers after the map is loaded
		mapRef.value.on("load", async () => {
			await updateShopsOnMap();
			setupMapListeners(); // Attach listeners for move/zoom
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
		});

		mapRef.value?.on("zoomend", async () => {
			console.log("Map zoomed, updating shops on map");
			await updateShopsOnMap();
		});
	}
};

// Close shop details
const closeShopDetails = () => {
	showShopDetails.value = false;
	selectedShop.value = null;
};
</script>

<style scoped>
.marker .mapboxgl-marker {
	background-image: url('https://docs.mapbox.com/demos/custom-markers-gl-js/mapbox-icon.png');
  background-size: cover;
  background-color:#7B1FA2;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
	z-index: 9999;
}
</style>
