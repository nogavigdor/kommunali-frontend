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

	const the_input = document.getElementById("address-input");
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
});
</script>
