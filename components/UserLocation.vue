<template>
	<div class="max-w-md mx-auto p-4">
		<form>
			<input
				id="address-input"
				v-model="query"
				type="text"
				name="address"
				placeholder="Please enter an address"
				autocomplete="off"
				@input="fetchSuggestions">
			<button
				v-if="showMapButton"
				class="bg-primary text-white px-4 py-2 rounded"
				@click.prevent="showMap">
				Show Map
			</button>
		</form>
		<ul
			v-if="suggestions.length"
			class="mt-2 border border-secondary-light rounded-md shadow bg-white max-h-40 overflow-y-auto">
			<li
				v-for="(suggestion, index) in suggestions"
				:key="index"
				class="px-4 py-2 cursor-pointer hover:bg-secondary-light transition-colors"
				@click="selectAddress(suggestion)">
				{{ suggestion }}
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { MapboxAddressAutofill, getAutofillSearchText } from "@mapbox/search-js-web";
import { debounce } from "lodash";
import { useShopsStore } from "@/stores/shops";

const config = useRuntimeConfig();
const query = ref("");
const suggestions = ref<string[]>([]);
const savedAddresses = ref<string[]>([]);
const showMapButton = ref(false);
const shopsStore = useShopsStore();

const isLoggedIn = ref(false);

onMounted(async () => {
	if (isLoggedIn.value) {
		await shopsStore.getShops(); // Fetch all shops
		savedAddresses.value = shopsStore.shops.map(
			shop => `${shop.address.street} ${shop.address.houseNumber}, ${shop.address.city}`,
		);
	}
});

// Fetch address suggestions from Mapbox
const fetchSuggestions = debounce(async () => {
	const autofillElement = new MapboxAddressAutofill();

	const inputElement = document.getElementById("address-input") as HTMLInputElement;
	if (inputElement) {
		// Attach autofill functionality to the input
		autofillElement.appendChild(inputElement);

		// Listen for autofill events
		inputElement.addEventListener("input", () => {
			console.log("User is typing: ", inputElement.value);
		});

		inputElement.addEventListener("autofill", (event: Event) => {
			const customEvent = event as CustomEvent;
			const autofillData = customEvent.detail;
			console.log("Selected Address Data: ", autofillData);

			// Use the address data for further processing (e.g., parsing coordinates)
		});
	}
}, 3000,
);
// Select a saved address
const selectSavedAddress = (address: string) => {
	query.value = address;
	showMapButton.value = true;

	// Update the user location based on the selected address
	parseAddressToCoordinates(address).then((coordinates) => {
		shopsStore.userLocation = coordinates;
	});
};

// Select a new address
const selectAddress = (address: string) => {
	query.value = address;
	showMapButton.value = true;
};

// Show the map with all stores
const showMap = async () => {
	const coordinates = await parseAddressToCoordinates(query.value);
	shopsStore.userLocation = coordinates;
	await shopsStore.getShops(); // Fetch shops within the boundaries
};

// Parse an address into coordinates
async function parseAddressToCoordinates(address: string): Promise<[number, number]> {
	try {
		const response: { features: { center: [number, number] }[] } = await $fetch(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
			{
				params: {
					access_token: config.public.mapboxApiKey,
				},
			},
		);
		return response.features[0].center; // [longitude, latitude]
	}
	catch (error) {
		console.error("Error parsing address:", error);
		return [0, 0];
	}
}
</script>
