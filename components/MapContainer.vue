<!-- MapContainer.vue -->
<template>
	<div
		id="map"
		class="flex-grow h-full w-full" />
</template>

<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import { useShopsStore } from "@/stores/shops";

const shopsStore = useShopsStore();
const { shops, getShops } = shopsStore;
console.log("The shops are:", shops);
const config = useRuntimeConfig() as unknown as { public: { mapboxApiKey: string } };

const mapRef = ref<mapboxgl.Map | null>(null) as Ref<mapboxgl.Map | null>;

const onMapLoad = async () => {
	// Initialize the map instance
	mapRef.value = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/light-v11",
		center: [-68.137343, 45.137451],
		zoom: 5,
	});

	// Waiting for the map to fully load before adding markers
	mapRef.value.on("load", async () => {
		// Fetch nearby shops on map load
		await getShops();

		// Display shops on the map as markers
		shops.forEach((shop) => {
			if (!shop.location || !shop.location.coordinates) {
				console.warn("Shop location is invalid:", shop);
				return;
			}
			const el = document.createElement("div");
			el.className = "marker";

			// Create a popup for additional shop info
			const popup = new mapboxgl.Popup({ offset: 25 }).setText(
				`${shop.name} - ${shop.address.street} ${shop.address.houseNumber}, ${shop.address.city}`,
			);

			// Create a marker for each shop
			new mapboxgl.Marker(el)
				.setLngLat(shop.location.coordinates)
				.setPopup(popup) // Attach popup to marker
				.addTo(mapRef.value as mapboxgl.Map);
		});
	});
};

// Initialize Mapbox on component mount
onMounted(() => {
	mapboxgl.accessToken = config.public.mapboxApiKey;
	onMapLoad();
});
</script>

<style scoped>
.marker {
	background-color: #ff6347;
	width: 20px;
	height: 20px;
	border-radius: 50%;
}
</style>
