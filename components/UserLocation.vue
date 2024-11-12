<template>
	<form>
		<input
			id="address-input"
			type="text"
			name="address"
			autocomplete="shipping street-address">
	</form>
</template>

<script setup lang="ts">
import { MapboxAddressAutofill } from "@mapbox/search-js-web";

const config = useRuntimeConfig();

onMounted(() => {
// instantiate a <mapbox-address-autofill> element using the MapboxAddressAutofill class
	const autofillElement = new MapboxAddressAutofill();

	autofillElement.accessToken = config.public.mapbox.accessToken;

	// set the <mapbox-address-autofill> element's options
	autofillElement.options = {
		country: "dk",
	};

	const the_input = document.getElementById("address-input") as HTMLInputElement;
	console.log(the_input);
	const the_form = the_input?.parentElement;
	console.log(the_form);

	// append the <input> to <mapbox-address-autofill>
	if (the_input) {
		autofillElement.appendChild(the_input);
	}
	// append <mapbox-address-autofill> to the <form>
	if (the_form) {
		the_form.appendChild(autofillElement);
	}

	// Define an interface for the custom autofill event detail
	interface AutofillEventDetail {
		features: {
			place_name: string;
			context: Array<{
				id: string;
				text: string;
			}>;
		}[];
	}

	// Add an event listener for the autofill completion
	(autofillElement as EventTarget).addEventListener("autofill", (event: Event) => {
		const customEvent = event as CustomEvent<AutofillEventDetail>;
		const feature = customEvent.detail.features[0];

		// Initialize parts of the address
		const street = feature.place_name;
		let city = "";
		let postalCode = "";

		// Iterate over the context array to find city and postal code
		for (const context of feature.context) {
			if (context.id.includes("place")) {
				city = context.text;
			}
			if (context.id.includes("postcode")) {
				postalCode = context.text;
			}
		}

		// Construct the full address
		const fullAddress = `${street}, ${postalCode} ${city}`;

		// Set the input field's value to the full address
		if (the_input) {
			the_input.value = fullAddress;
		}
	});
});
</script>
