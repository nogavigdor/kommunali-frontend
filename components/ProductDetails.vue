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
				v-show="canRequestProduct"
				class="btn-primary"
				@click="addProductRequest(currentProduct._id || '', 'request')">
				{{ requestType }}
			</button>
			<div v-show="totalNumberInQueue > 0">
				<p
					v-if="userNumberInQueue>0"
					class="text-neutral-dark">
					You are number {{ userNumberInQueue }} in the queue.
				</p>
				<p
					v-else
					class="text-neutral-dark">
					{{ totalNumberInQueue }} people in the queue.
				</p>
			</div>
			<button
				v-show="editable? false : true"
				v-if="hasUserRequestedProduct"
				class="btn-secondary"
				@click="addProductRequest(currentProduct._id || '', 'cancel')">
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

const isLoggedIn = computed(() => userStore.loggedIn);

const shopsStore = useShopsStore();

const userNumberInQueue = computed(() => {
	// if (!currentProduct.value || !currentProduct.value.requestQueue || !userStore.user) {
	//	return 0; // Return 0 if any required data is missing
	// }
	if (totalNumberInQueue.value === 0) {
		return 0;
	}
	// Find the user's position in the requestQueue
	// if the index is -1, the user is not in the queue
	const position = currentProduct.value.requestQueue.findIndex(
		entry => entry.user === userStore.user._id,
	);

	// If the user is found, return their position (1-based index), otherwise return 0
	return position !== -1 ? position + 1 : 0;
});

const totalNumberInQueue = computed(() => {
	if (!currentProduct.value || !currentProduct.value.requestQueue) {
		return 0; // Return 0 if any required data is missing
	}

	return currentProduct.value.requestQueue.length;
});

const canRequestProduct = computed(() => {
	return !props.editable && !userStore.user.requested_products.some(
		entry => entry.product === currentProduct.value?._id,
	);
});
const props = defineProps<{
	selectedShopId: string | undefined;
	product: IProduct;
	editable: boolean;
}>();

const openModal = ref(false);

const requestType = computed(() => {
	return currentProduct.value.status === "available" ? "Request Product" : "Queue Product";
});

const addProductRequest = async (productId: string, action: "request" | "cancel") => {
	console.log("the product id is:", productId);
	console.log("the action is:", action);
	console.log("the selected shop id is:", props.selectedShopId);
	console.log("the product object is:", currentProduct.value);
	console.log("the user shop details are:", shopsStore.userShop);
	if (isLoggedIn.value) {
		if (props.selectedShopId) {
			await shopsStore.addProductRequest(props.selectedShopId, productId, action);
		}
		else {
			console.error("Selected shop ID is undefined");
		}
	}
	else {
		alert("You need to be logged in to request a product");
	}
};

const hasUserRequestedProduct = computed(() => {
	console.log("the user request products array is:", userStore.user.requested_products);
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
