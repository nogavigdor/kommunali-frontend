<template>
	<!-- Edit Product Modal -->
	<UModal
		v-model="showAddModal"
		title="Edit Product">
		<form @submit.prevent="addProduct">
			<div class="mb-2">
				<label
					for="edit-product-name"
					class="block text-sm font-medium text-neutral-dark">Product Name</label>
				<input
					id="edit-product-name"
					v-model="newProductData.name"
					type="text"
					class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm"
					required>
			</div>
			<div class="mb-2">
				<label
					for="edit-product-description"
					class="block text-sm font-medium text-neutral-dark">Description</label>
				<textarea
					id="edit-product-description"
					v-model="newProductData.description"
					class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm"
					required />
			</div>
			<div class="mb-2">
				<label
					for="edit-product-price"
					class="block text-sm font-medium text-neutral-dark">Price</label>
				<input
					id="edit-product-price"
					v-model="newProductData.price"
					type="number"
					class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm"
					required>
			</div>
			<div class="mb-2">
				<label
					for="edit-product-image-url"
					class="block text-sm font-medium text-neutral-dark">Image URL</label>
				<ImageUpload
					@image-uploaded="setImageUrl"
					@uploading="handleSaveButton" />
				<p
					v-if="newProductData.imageUrl"
					class="mt-2 text-sm text-neutral-dark">
					Image URL: <a
						:href="newProductData.imageUrl"
						target="_blank"
						class="text-brandPrimary-500 hover:underline">{{ newProductData.imageUrl }}</a>
				</p>
				<button
					type="submit"
					:disabled="!canSave"
					class="w-full bg-brandPrimary-500 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-brandPrimary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandPrimary-500">
					<span v-if="!canSave">
						<Iccon
							name="uli:spinner"
							class="animate-spin text-xl mr-2" />
						Image is uploading...
					</span>
					<span v-else>
						<Icon
							name="uli:plus-circle"
							class="text-xl mr-2" />
						Save Product
					</span>
				</button>
			</div>
		</form>
	</UModal>
</template>

<script setup lang="ts">
import type { IProduct } from "@/types/product";
import { useShopsStore } from "@/stores/shops";

const showAddModal = defineModel<boolean>();

const shopsStore = useShopsStore();

const canSave = ref(false);

const newProductData = ref<IProduct>({
	_id: "",
	name: "",
	description: "",
	price: 0,
	imageUrl: "",
	status: "available",
	requestQueue: [],
	soldTo: undefined,
});

// Set the uploaded image URL
const setImageUrl = (url: string) => {
	newProductData.value.imageUrl = url;
};

const handleSaveButton = (uploading: boolean) => {
	// Disable the save button while image uploading
	canSave.value = !uploading;
};

const addProduct = async () => {
	try {
		await shopsStore.addProduct(newProductData.value);
		//	const index = userShop.value?.products.findIndex(product => product._id === editProductData.value._id);
		//	if (index !== undefined && index !== -1) {
		//		userShop.value!.products[index] = { ...editProductData.value };
		//	}
		// reset the form
		newProductData.value = {
			_id: "",
			name: "",
			description: "",
			price: 0,
			imageUrl: "",
			status: "available",
			requestQueue: [],
			soldTo: undefined,
		};
		showAddModal.value = false;
	}
	catch (error) {
		console.error("Failed to update product:", error);
	}
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
