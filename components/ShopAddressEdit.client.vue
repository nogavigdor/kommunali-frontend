<template>
	<div class="flex max-w-md mx-auto  p-4">
		<form class="flex gap-x-4">
			<input
				id="address-input-2"
				type="text"
				name="address"
				placeholder="Please enter an address"
				autocomplete="street-address"
				>
			<!-- input
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
				autocomplete="postal-code" -->
			<p v-if="fullAddressLine">
				{{ fullAddressLine }}
			</p>
			<button
				v-if="!autoEmit && showMapButton"
				class="btn-primary"
				@click.prevent="$emit('change-address', addressData)">
				Update Address
			</button>
		</form>
	</div>
</template>

<script setup lang="ts">
import { MapboxAddressAutofill } from "@mapbox/search-js-web";
import type { IShop } from "@/types/shop";
import { useShopsStore } from "@/stores/shops";
import type { AutofillData } from "@/types/autofillData";
import type { AddressData } from "@/types/addressData";
import { set } from "date-fns";

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
			if (props.autoEmit) {
				emit("change-address", addressData.value);
			}
			else {
				showMapButton.value = true;
			}
		});
	}
};
</script>
