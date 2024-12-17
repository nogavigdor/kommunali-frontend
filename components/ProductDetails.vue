<template>
	<div
		class=" min-w-[150px] max-w-xs bg-white border border-neutral-dark rounded-lg p-2 shadow-soft">
		<NuxtImg
			:src="currentProduct.imageUrl || imagePlaceholder"
			:alt="currentProduct.name || 'Product Image'"
			width="150"
			height="128"
			placeholder
			placeholder-class="bg-gray-200 animate-pulse"
			class="w-full h-32 object-cover rounded-lg"
			@load="handleImageLoad"
			@error="handleImageError" />
		<h3>
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
		<div>
			<button
				v-show="editable? false : true"
				v-if="['available', 'reserved'].includes(currentProduct.status)"
				class="btn-primary">
				{{ requestType }}
			</button>
			<button
				v-show="editable? false : true"
				v-if="cancelRequest"
				class="btn-secondary">
				Cancel Request
			</button>
		</div>
		<ProductDetailsEditModal
			v-model="openModal"
			:product="currentProduct" />
	</div>
</template>

<script setup lang="ts">
import { useShopsStore } from "@/stores/shops";
import type { IProduct } from "@/types/product";
import imagePlaceholder from "@/assets/images/image-placeholder.webp";
import { useUserStore } from "@/stores/user";

const isLoading = ref(true);

const userStore = useUserStore();

const shopsStore = useShopsStore();

const props = defineProps<{
	selectedShopId: string | undefined;
	product: IProduct;
	editable: boolean;
}>();

const openModal = ref(false);

const requestType = computed(() => {
	return currentProduct.value.status === "available" ? "Request Product" : "Queue Product";
});

const cancelRequest = computed(() => {
	if (userStore.user.requested_products.find(entry => entry.product === currentProduct.value._id)) {
		return true;
	}
	else {
		return false;
	}
});

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

const handleImageLoad = () => {
	isLoading.value = false; // Stop showing loading animation
};

const handleImageError = () => {
	isLoading.value = false; // Stop loading state on error
	console.error("Image failed to load:", currentProduct.value.imageUrl);
};
</script>

<style scoped>
</style>
