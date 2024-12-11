<template>
	<div
		class=" min-w-[150px] max-w-xs  border border-neutral-dark rounded-lg p-2 shadow-soft">
		<img
			:src="product.imageUrl ? product.imageUrl : imagePlaceholder"
			:alt="product.name"
			class="w-full h-32 object-cover rounded-lg">
		<h3 class="text-lg font-heading mt-2">
			{{ product.name }}
		</h3>
		<p class="text-brandSecondary-dark">
			{{ product.price }} DKK
		</p>
		<button
			v-if="editable"
			@click="openModal = !openModal">
			Edit
		</button>
		<ProductDetailsEditModal
			v-model="openModal"
			:product="product" />
	</div>
</template>

<script setup lang="ts">
import { useShopsStore } from "@/stores/shops";
import type { IProduct } from "@/types/product";
import imagePlaceholder from "@/assets/images/image-placeholder.webp";

const props = defineProps<{
	product: IProduct;
	editable: boolean;
}>();

const openModal = ref(false);

// const shopsStore = useShopsStore();
</script>

<style scoped>
</style>
