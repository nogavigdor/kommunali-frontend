<template>
	<div class="flex max-w-md mx-auto  p-4">
		<form class="flex flex-row-reverse gap-x-4">
			<input
				id="address-input-2"
				type="text"
				name="address"
				placeholder="Please enter an address"
				autocomplete="street-address"
				@input.once="fetchSuggestions">
			<input
				type="text"
				name="houseNumber"
				placeholder="House Number"
				autocomplete="address-line2">
			<input
				type="text"
				name="city"
				placeholder="City"
				autocomplete="address-level2">
			<input
				type="text"
				name="postalCode"
				placeholder="Postal Code"
				autocomplete="postal-code">
			<button
				v-if="showMapButton"
				class="btn-primary"
				@click.prevent="$emit('change-address', autofillData)">
				Find your community
			</button>
		</form>
	</div>
</template>

<script setup lang="ts">
import { MapboxAddressAutofill } from "@mapbox/search-js-web";
import type { IShop } from "@/types/shop";
import { useShopsStore } from "@/stores/shops";

defineEmits(["change-address"]);

const config = useRuntimeConfig();
const query = ref("");
const savedAddresses = ref<string[]>([]);
const showMapButton = ref(false);
const shopsStore = useShopsStore();
const addressData = ref({
	street: "",
	houseNumber: "",
	city: "",
	postalCode: "",
	country: "",
});
const fullAddressLine = ref("");
interface AutofillData {
	features: Array<{
		properties: {
			street: string; // street name
			address_number: string; // house number
			address_level2: string; // city
			postcode: string; // postal code
			country: string; // country
		};
	}>;
}

const autofillData = ref<AutofillData>({ features: [] });

const isLoggedIn = ref(false);

onMounted(async () => {
	if (isLoggedIn.value) {
		savedAddresses.value = shopsStore.shops.map(
			(shop: IShop) => `${shop.address.street} ${shop.address.houseNumber}, ${shop.address.city}`,
		);
	}
});

// Fetch address suggestions from Mapbox
const fetchSuggestions = () => {
	const autofillElement = new MapboxAddressAutofill();
	autofillElement.accessToken = config.public.mapboxApiKey;
	autofillElement.browserAutofillEnabled = false;

	const inputElement = document.getElementById("address-input-2") as HTMLInputElement;
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

			// capturing all address properties
			addressData.value = {
				street: autofillData.value.features[0].properties.street,
				houseNumber: autofillData.value.features[0].properties.address_number,
				city: autofillData.value.features[0].properties.address_level2,
				postalCode: autofillData.value.features[0].properties.postcode,
				country: autofillData.value.features[0].properties.country,
			};

			fullAddressLine.value = `${addressData.value.street} ${addressData.value.houseNumber},
			 ${addressData.value.postalCode} ${addressData.value.city}`;

			setTimeout(() => {
				(document.getElementById("address-input")! as HTMLInputElement).value = fullAddressLine.value;
			}, 1);
			query.value = fullAddressLine.value;

			console.log("Selected Address Data: ", autofillData);
			console.log("Full Address Line: ", fullAddressLine.value);
			showMapButton.value = true;
		});
	}
};
</script>
