<template>
	<div class="flex max-w-md mx-auto  p-4">
		<form class="flex gap-x-4">
			<input
				id="address-input-2"
				type="text"
				name="address"
				placeholder="Please enter an address"
				autocomplete="street-address">
			<p v-if="fullAddressLine">
				{{ fullAddressLine }}
			</p>
			<button
				v-if="!autoEmit && showMapButton"
				class="btn-primary"
				@click.prevent="handleAddressUpdate">
				Update Address
			</button>
		</form>
	</div>
</template>

<script setup lang="ts">
import { MapboxAddressAutofill } from "@mapbox/search-js-web";
import { set } from "date-fns";
import type { IShop } from "@/types/shop";
import { useShopsStore } from "@/stores/shops";
import type { AutofillData } from "@/types/autofillData";
import type { AddressData } from "@/types/addressData";

const emit = defineEmits(["change-address"]);

const props = defineProps({
	autoEmit: {
		type: Boolean,
		default: false,
	},
});

const config = useRuntimeConfig();
const savedAddresses = ref<string[]>([]);
const showMapButton = ref(false);
const shopsStore = useShopsStore();
const addressData = ref<AddressData>({
	street: "",
	houseNumber: "",
	city: "",
	postalCode: "",
	country: "",
	coordinates: [0, 0],
});
const fullAddressLine = ref("");

const autofillData = ref<AutofillData>({ features: [] });

const isLoggedIn = ref(false);

onMounted(async () => {
	setUpAutoFill();
	if (isLoggedIn.value) {
		savedAddresses.value = shopsStore.shops.map(
			(shop: IShop) => `${shop.address.street} ${shop.address.houseNumber}, ${shop.address.city}`,
		);
	}
});

// Fetch address suggestions from Mapbox
const setUpAutoFill = () => {
	const autofillElement = new MapboxAddressAutofill();
	autofillElement.accessToken = config.public.mapboxApiKey;
	autofillElement.browserAutofillEnabled = false;
	autofillElement.options.country = "dk";

	const inputElement = document.getElementById("address-input-2") as HTMLInputElement;
	const formElement = inputElement.parentElement as HTMLFormElement;

	if (inputElement) {
		// Attach autofill functionality to the input
		autofillElement.appendChild(inputElement);
		formElement.appendChild(autofillElement);

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
				coordinates: autofillData.value.features[0].geometry.coordinates,
			};

			fullAddressLine.value = `${addressData.value.street} ${addressData.value.houseNumber}, `
			+ `${addressData.value.postalCode} ${addressData.value.city}`;

			console.log("Selected Address Data: ", autofillData);
			console.log("Full Address Line: ", fullAddressLine.value);
			setTimeout(() => {
				inputElement.value = fullAddressLine.value;
			}, 1);
			// when this component is integrated within the NewShop component
			// the autoEmit props is defined as true and therefore the address is emitted
			// if its within the ShopEdit context, the address is not emitted
			if (props.autoEmit) {
				emit("change-address", addressData.value);
			}
			// will occur when the in ShopEdit context
			// when we want to address to be updated on button click
			else {
				showMapButton.value = true;
			}
		});
	}
};
// Emit the address data to the parent component
const handleAddressUpdate = () => {
	try {
		emit("change-address", addressData.value);
		showMapButton.value = false; // Only set to false if no errors occur
		console.log("Address successfully emitted!");
	}
	catch (error) {
		console.error("Failed to emit address:", error);
		alert("An error occurred while updating the address. Please try again.");
	}
};
</script>
