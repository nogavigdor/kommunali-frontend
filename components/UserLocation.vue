<template>
	<div class="relative flex max-w-md mx-auto  p-4">
		<FindMe />
		<form
			id="address-form"
			class="flex flex-col-reverse md:flex-row-reverse gap-x-4"
			@submit.prevent>
			<button
				v-if="showMapButton"
				class="btn-primary"
				@click.prevent="handleAddressUpdate">
				Find your community
			</button>
		</form>
		<!-- ul
			v-if="suggestions.length"
			class="mt-2 border border-secondary-light rounded-md shadow bg-white max-h-40 overflow-y-auto">
			<li
				v-for="(suggestion, index) in suggestions"
				:key="index"
				class="px-4 py-2 cursor-pointer hover:bg-secondary-light transition-colors"
				@click="selectAddress(suggestion)">
				{{ suggestion }}
			</li>
		</ul -->
	</div>
</template>

<script setup lang="ts">
import { MapboxGeocoder } from "@mapbox/search-js-web";
import type { IShop } from "@/types/shop";
import { useShopsStore } from "@/stores/shops";
import { useUserStore } from "~/stores/user";

defineEmits(["change-address"]);

const config = useRuntimeConfig();

// const suggestions = ref<string[]>([]);
const savedAddresses = ref<string[]>([]);
const showMapButton = ref(false);
const shopsStore = useShopsStore();
const userStore = useUserStore();

const coordinates = ref<[number, number] | null>(null);

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
	const autofillElement = new MapboxGeocoder();
	autofillElement.accessToken = config.public.mapboxApiKey;
	autofillElement.options.country = "dk";
	autofillElement.placeholder = "Enter your address";

	const formElement = document.getElementById("address-form") as HTMLFormElement;

	if (formElement) {
		// Attach autofill functionality to the input
		formElement.appendChild(autofillElement);

		autofillElement.addEventListener("retrieve", (event: Event) => {
			console.log("Retrieve event");
			console.log(event);
			const customEvent = event as CustomEvent;
			const feature = customEvent.detail;

			coordinates.value = feature.geometry.coordinates;

			showMapButton.value = true;
		});
	}
};

const handleAddressUpdate = () => {
	if (coordinates.value) {
		userStore.userLocation = coordinates.value;
	}
};
</script>
