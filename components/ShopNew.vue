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
					class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm" />
			</div>
			<div class="mb-4">
				<ShopAddressEdit
					auto-emit
					@change-address="prepareNewAddress" />
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
import { useShopsStore } from "@/stores/shops";
import type { AddressData } from "@/types/addressData";

const shopStore = useShopsStore();

const emit = defineEmits(["shop-created"]);

const newShop = ref<Omit<IShop, "_id" | "ownerFirebaseId">>({
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

const prepareNewAddress = async (addressData: AddressData) => {
	// Prepare the data fields in the same format as updateShopField
	newShop.value.address.street = addressData.street;
	newShop.value.address.houseNumber = addressData.houseNumber;
	newShop.value.address.city = addressData.city;
	newShop.value.address.postalCode = addressData.postalCode;
	newShop.value.location.coordinates = addressData.coordinates;
};

const submitForm = () => {
	try {
		console.log("New Shop Details:", newShop.value);
		// Validate the form data
		if (!newShop.value.name || !newShop.value.address.street || !newShop.value.address.houseNumber || !newShop.value.address.postalCode || !newShop.value.address.city || newShop.value.location.coordinates.length !== 2
			|| isNaN(newShop.value.location.coordinates[0])
			|| isNaN(newShop.value.location.coordinates[1])) {
			alert("Please fill in all required fields.");
			return;
		}
		shopStore.createShop(newShop.value);
		console.log("New Shop Details:", newShop.value);
		emit("shop-created", newShop.value);
	}
	catch (error) {
		console.error("There was an error creating the shop, please try later", error);
	}
};
</script>

  <style scoped>

  </style>
