<template>
	<div
		class=" min-w-[150px] max-w-xs bg-white border border-neutral-dark rounded-lg p-2 shadow-soft">
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
		<UTooltip text="Edit Product">
			<button
				v-show="editable"
				class=" hover:text-green-700"
				aria-label="Edit Product"
				@click="openModal = !openModal">
				<Icon
					name="uil:edit"
					class="text-xl" />
			</button>
		</UTooltip>
		<UTooltip text="Delete Product">
			<button
				v-show="editable"
				class=" hover:text-red-700"
				aria-label="Delete Product"
				@click="deleteProduct()">
				<Icon
					name="uil:trash"
					class="text-xl" />
			</button>
		</UTooltip>
		<ProductDetailsEditModal
			v-model="openModal"
			:product="currentProduct" />
	</div>
</template>

<script setup lang="ts">
import { useShopsStore } from "@/stores/shops";
import type { IProduct } from "@/types/product";
import imagePlaceholder from "@/assets/images/image-placeholder.webp";

const shopsStore = useShopsStore();

const props = defineProps<{
	selectedShopId: string | undefined;
	product: IProduct;
	editable: boolean;
}>();

const openModal = ref(false);

// Create a local reference for the product
// const currentProduct = ref({ ...props.product });

// Dynamically fetch the current shop
// const selectedShop = computed(() => {
//	return shopStore.shops.find(shop => shop._id === props.selectedShopId) || null;
// });

// Dynamically fetch the current product
// const currentProduct = computed(() => {
// return selectedShop.value?.products.find(product => product._id === props.product._id) || props.product;
// });
const currentProduct = ref({ ...props.product,
});

watch(() => shopsStore.shops, () => {
	currentProduct.value = { ...props.product };
});
const deleteProduct = async () => {
	if (confirm("Are you sure you want to delete this product?")) {
		console.log("the shops arrany in shop store is:", shopsStore.shops);
		console.log("the product to be deleted is:", currentProduct.value);
		await shopsStore.deleteProduct(currentProduct.value._id || "");
	}
};

// const shopsStore = useShopsStore();
</script>

<style scoped>
</style>
