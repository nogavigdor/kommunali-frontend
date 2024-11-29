<template>
	<div class="max-w-md mx-auto p-4">
		<h2 class="text-2xl font-bold mb-4 text-brandPrimary-500">
			Add New Shop
		</h2>
		<form @submit.prevent="submitForm">
			<div class="mb-4">
				<label
					for="shop-name"
					class="block text-sm font-medium text-neutral-dark">Shop Name</label>
				<input
					id="shop-name"
					v-model="newShop.name"
					type="text"
					class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm"
					required>
			</div>
			<div class="mb-4">
				<label
					for="shop-description"
					class="block text-sm font-medium text-neutral-dark">Description</label>
				<textarea
					id="shop-description"
					v-model="newShop.description"
					class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm"
					required />
			</div>
			<div class="mb-4">
				<label
					for="shop-street"
					class="block text-sm font-medium text-neutral-dark">Street</label>
				<input
					id="shop-street"
					v-model="newShop.address.street"
					type="text"
					class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm"
					required>
			</div>
			<div class="mb-4">
				<label
					for="shop-house-number"
					class="block text-sm font-medium text-neutral-dark">House Number</label>
				<input
					id="shop-house-number"
					v-model="newShop.address.houseNumber"
					type="text"
					class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm"
					required>
			</div>
			<div class="mb-4">
				<label
					for="shop-apartment"
					class="block text-sm font-medium text-neutral-dark">Apartment</label>
				<input
					id="shop-apartment"
					v-model="newShop.address.apartment"
					type="text"
					class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm">
			</div>
			<div class="mb-4">
				<label
					for="shop-postal-code"
					class="block text-sm font-medium text-neutral-dark">Postal Code</label>
				<input
					id="shop-postal-code"
					v-model="newShop.address.postalCode"
					type="text"
					class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm"
					required>
			</div>
			<div class="mb-4">
				<label
					for="shop-city"
					class="block text-sm font-medium text-neutral-dark">City</label>
				<input
					id="shop-city"
					v-model="newShop.address.city"
					type="text"
					class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm"
					required>
			</div>
			<div class="mb-4">
				<label
					for="shop-coordinates"
					class="block text-sm font-medium text-neutral-dark">Coordinates (Longitude, Latitude)</label>
				<input
					id="shop-coordinates"
					v-model="newShop.location.coordinates"
					type="text"
					class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm"
					placeholder="e.g., -122.4194, 37.7749"
					required>
			</div>
			<button
				type="submit"
				class="w-full bg-brandPrimary-500 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-brandPrimary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandPrimary-500">
				Add Shop
			</button>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { IShop } from "@/types/shop";

const emit = defineEmits(["shop-created"]);

const newShop = ref<IShop>({
	owner: "",
	name: "",
	description: "",
	location: {
		type: "Point",
		coordinates: [0, 0],
	},
	address: {
		street: "",
		houseNumber: "",
		apartment: "",
		postalCode: "",
		city: "",
	},
	products: [],
	createdAt: new Date(),
	updatedAt: new Date(),
});

const submitForm = () => {
	console.log("New Shop Details:", newShop.value);
	emit("shop-created", newShop.value);
};
</script>

  <style scoped>

  </style>
