<template>
	<!-- Edit Product Modal -->
	<UModal
		v-model="showEditModal"
		title="Edit Product">
		<form @submit.prevent="updateProduct">
			<div class="mb-2">
				<label
					for="edit-product-name"
					class="block text-sm font-medium text-neutral-dark">Product Name</label>
				<input
					id="edit-product-name"
					v-model="editProductData.name"
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
					v-model="editProductData.description"
					class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm"
					required />
			</div>
			<div class="mb-2">
				<label
					for="edit-product-price"
					class="block text-sm font-medium text-neutral-dark">Price</label>
				<input
					id="edit-product-price"
					v-model="editProductData.price"
					type="number"
					class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm"
					required>
			</div>
			<div class="mb-2">
				<label
					for="edit-product-image-url"
					class="block text-sm font-medium text-neutral-dark">Image URL</label>
				<input
					id="edit-product-image-url"
					v-model="editProductData.imageUrl"
					type="text"
					class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm">
			</div>
			<button
				type="submit"
				class="w-full bg-brandPrimary-500 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-brandPrimary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandPrimary-500">
				<HeroIcon
					name="check-circle"
					class="w-5 h-5 inline-block mr-2" />
				Update Product
			</button>
		</form>
	</UModal>
</template>

<script setup lang="ts">
import type { IProduct } from "@/types/product";
import { useShopsStore } from "@/stores/shops";

const showEditModal = defineModel<boolean>();

const props = defineProps<{
	product: IProduct;
}>();

const shopsStore = useShopsStore();

const editProductData = ref<IProduct>({
	_id: "",
	name: "",
	description: "",
	price: 0,
	imageUrl: "",
	status: "available",
	reservedFor: null,
	reservedExpiration: null,
	soldTo: undefined,
});

onMounted(() => {
	editProductData.value = { ...props.product };
});

const updateProduct = async () => {
	try {
		await shopsStore.updatProduct(editProductData.value);
		//	const index = userShop.value?.products.findIndex(product => product._id === editProductData.value._id);
		//	if (index !== undefined && index !== -1) {
		//		userShop.value!.products[index] = { ...editProductData.value };
		//	}
		showEditModal.value = false;
	}
	catch (error) {
		console.error("Failed to update product:", error);
	}
};
</script>
