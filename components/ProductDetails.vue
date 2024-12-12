<template>
	<div
		class=" min-w-[150px] max-w-xs  border border-neutral-dark rounded-lg p-2 shadow-soft">
		<img
			:src="currentProduct.imageUrl ? currentProduct.imageUrl : imagePlaceholder"
			:alt="currentProduct.name"
			class="w-full h-32 object-cover rounded-lg">
		<h3 class="text-lg font-heading mt-2">
			{{ currentProduct.name }}
		</h3>
		<p class="text-brandSecondary-dark">
			{{ currentProduct.price }} DKK
		</p>
		<button
			v-if="editable"
			@click="openModal = !openModal">
			Edit
		</button>
		<ProductDetailsEditModal
			v-model="openModal"
			:product="currentProduct" />
	</div>
</template>

<script setup lang="ts">
import { useShopsStore } from "@/stores/shops";
import type { IProduct } from "@/types/product";
import imagePlaceholder from "@/assets/images/image-placeholder.webp";

const shopStore = useShopsStore();

const props = defineProps<{
	product: IProduct;
	editable: boolean;
}>();

const openModal = ref(false);

// Create a local reference for the product
const currentProduct = ref({ ...props.product });

// Watch the userShop state and update the current product when the product updates.
// Whenever the userShop is updated with new product data, the currentProduct is synchronized
watch(
	() => shopStore.userShop?.products,
	(updatedProducts) => {
		if (updatedProducts) {
			const updatedProduct = updatedProducts.find(
				(p: IProduct) => p._id === props.product._id,
			);
			if (updatedProduct) {
				currentProduct.value = { ...updatedProduct };
			}
		}
	},
	{ // Ensures the watcher runs when the component is mounted, setting the initial value of currentProduct
		immediate: true,
		// Ensures the watcher tracks changes to the entire products array
		deep: true },
);

// const shopsStore = useShopsStore();
</script>

<style scoped>
</style>
