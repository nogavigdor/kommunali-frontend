<template>
	<div>
		<!-- Your address input or map element here -->
		<input
			id="address-input"
			type="text"
			placeholder="Enter address">
	</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

declare global {
	interface Window {
		google: any;
	}
}

const config = useRuntimeConfig();

onMounted(() => {
	const script = document.createElement("script");
	script.src = `https://maps.googleapis.com/maps/api/js?key=${config.public.googleMapsApiKey}&libraries=places`;
	script.async = true;
	document.head.appendChild(script);

	script.onload = () => {
		// Initialize Google Maps Autocomplete or other Google Maps features
		const input = document.getElementById("address-input") as HTMLInputElement;
		const autocomplete = new window.google.maps.places.Autocomplete(input, {
			componentRestrictions: { country: "dk" },
		});

		// Additional logic for handling selected places
		autocomplete.addListener("place_changed", () => {
			const place = autocomplete.getPlace();
			console.log("Selected place:", place);
		});
	};
});
</script>
