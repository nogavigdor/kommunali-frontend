<template>
	<div class="flex max-w-md mx-auto  p-4">
		<form class="flex flex-row-reverse gap-x-4">
			<input
				id="address-input"
				v-model="query"
				type="text"
				name="address"
				placeholder="Please enter an address"
				autocomplete="street-address"
				@input.once="fetchSuggestions">
			<button
				v-if="showMapButton"
				class="btn-primary"
				@click.prevent="$emit('change-address', autofillData)">
				Find your community
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
import { MapboxAddressAutofill } from "@mapbox/search-js-web";
import type { IShop } from "@/types/shop";
import { useShopsStore } from "@/stores/shops";

defineEmits(["change-address"]);

const config = useRuntimeConfig();
const query = ref("");
const suggestions = ref<string[]>([]);
const savedAddresses = ref<string[]>([]);
const showMapButton = ref(false);
const shopsStore = useShopsStore();
const autofillData = ref({});

const isLoggedIn = ref(false);

onMounted(async () => {
	if (isLoggedIn.value) {
		savedAddresses.value = shopsStore.shops.map(
			(shop: IShop) => `${shop.address.street} ${shop.address.houseNumber}, ${shop.address.city}`,
		);
	}
});

// Scroll method to bring input into focus
const scrollToInput = () => {
	const inputElement = document.getElementById("address-input");
	if (inputElement) {
		inputElement.scrollIntoView({ behavior: "smooth" });
		inputElement.focus(); // Optional: To focus on the input field
	}
};

// Fetch address suggestions from Mapbox
const fetchSuggestions = () => {
	const autofillElement = new MapboxAddressAutofill();
	autofillElement.accessToken = config.public.mapboxApiKey;
	autofillElement.browserAutofillEnabled = false;

	const inputElement = document.getElementById("address-input") as HTMLInputElement;
	const formElement = inputElement.parentElement as HTMLFormElement;

	if (inputElement) {
		// Attach autofill functionality to the input
		autofillElement.appendChild(inputElement);
		formElement.appendChild(autofillElement);

		// Listen for autofill events
		inputElement.addEventListener("input", () => {
			console.log("User is typing: ", inputElement.value);
		});

		autofillElement.addEventListener("retrieve", (event: Event) => {
			console.log("Retrieve event");
			const customEvent = event as CustomEvent;
			autofillData.value = customEvent.detail;
			console.log("Selected Address Data: ", autofillData);
			showMapButton.value = true;

			// Use the address data for further processing (e.g., parsing coordinates)
		});
	}
};
</script>
