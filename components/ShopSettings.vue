<template>
	<div class="p-6">
		<h2 class="text-xl font-bold mb-4 text-brandPrimary-500">
			Shop Settings
		</h2>
		<div class="mb-4">
			<h3 class="text-lg font-semibold">
				Shop Details
			</h3>
			<p><strong>Name:</strong> {{ userShop?.name }}</p>
			<p><strong>Description:</strong> {{ userShop?.description }}</p>
			<p><strong>Address:</strong> {{ userShop?.address.street }}, {{ userShop?.address.houseNumber }}, {{ userShop?.address.city }}, {{ userShop?.address.postalCode }}</p>
			<p><strong>Coordinates:</strong> {{ userShop?.location.coordinates[1] }}, {{ userShop?.location.coordinates[0] }}</p>
		</div>
		<div class="mb-4">
			<h3 class="text-lg font-semibold">
				Products
			</h3>
			<ul>
				<li
					v-for="product in userShop?.products || []"
					:key="product._id"
					class="mb-2 flex justify-between items-center">
					<div>
						<strong>{{ product.name }}</strong> - {{ product.description }} - {{ product.price }} Kr
					</div>
					<div>
						<button
							class="btn btn-primary btn-sm"
							@click="openEditModal(product)">
							<HeroIcon
								name="pencil"
								class="w-5 h-5 inline-block" />
						</button>
						<button
							class="btn btn-error btn-sm"
							@click="product._id && deleteProduct(product._id)">
							<HeroIcon
								name="trash"
								class="w-5 h-5 inline-block" />
						</button>
					</div>
				</li>
			</ul>
		</div>
		<div class="mb-4">
			<h3 class="text-lg font-semibold">
				Add Product
			</h3>
			<form @submit.prevent="addProduct">
				<div class="mb-2">
					<label
						for="product-name"
						class="block text-sm font-medium text-neutral-dark">Product Name</label>
					<input
						id="product-name"
						v-model="newProduct.name"
						type="text"
						class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm"
						required>
				</div>
				<div class="mb-2">
					<label
						for="product-description"
						class="block text-sm font-medium text-neutral-dark">Description</label>
					<textarea
						id="product-description"
						v-model="newProduct.description"
						class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm" />
				</div>
				<div class="mb-2">
					<label
						for="product-price"
						class="block text-sm font-medium text-neutral-dark">Price</label>
					<input
						id="product-price"
						v-model="newProduct.price"
						type="number"
						class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm"
						required>
				</div>
				<div class="mb-2">
					<label
						for="product-image-url"
						class="block text-sm font-medium text-neutral-dark">Image URL</label>
					<input
						id="product-image-url"
						v-model="newProduct.imageUrl"
						type="text"
						class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm">
				</div>
				<button
					type="submit"
					class="w-full bg-brandPrimary-500 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-brandPrimary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandPrimary-500">
					<HeroIcon
						name="plus-circle"
						class="w-5 h-5 inline-block mr-2" />
					Add Product
				</button>
			</form>
		</div>

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
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { useShopsStore } from "@/stores/shops";
import type { IProduct } from "@/types/product";
import type { IShop } from "@/types/shop";

onMounted(async () => {
	if (userStore.user && userStore.user.stores && userStore.user.stores.length > 0) {
		const shop = userStore.user.stores[0] as IShop;
		console.log("The shop is is: ", shop);
		if (shop._id) {
			await shopsStore.getUserShop(shop._id);
		}
		else {
			console.error("Shop ID is undefined");
		}
	}
});

const userStore = useUserStore();
const shopsStore = useShopsStore();
const userShop = computed(() => shopsStore.userShop);
const newProduct = ref<IProduct>({
	name: "",
	description: "",
	price: 0,
	imageUrl: "",
	status: "available",
	reservedFor: null,
	reservedExpiration: null,
	soldTo: undefined,
});

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

const showEditModal = ref(false);

const addProduct = async () => {
	try {
		await shopsStore.addProduct(newProduct.value);
		console.log("After adding the product the new products list is:", shopsStore.userShop?.products);
		//	userShop.value?.products.push(newProduct.value);
		newProduct.value = {
			name: "",
			description: "",
			price: 0,
			imageUrl: "",
			status: "available",
			reservedFor: null,
			reservedExpiration: null,
			soldTo: undefined,
		};
	}
	catch (error) {
		console.error("Failed to add product:", error);
	}
};

const openEditModal = (product: IProduct) => {
	console.log("Opening Edit Modal with Product:", product);
	editProductData.value = { ...product };
	showEditModal.value = true;
};

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

const deleteProduct = async (productId: string) => {
	try {
		await shopsStore.deleteProduct(productId);
		userShop.value!.products = userShop.value!.products.filter(product => product._id !== productId);
	}
	catch (error) {
		console.error("Failed to delete product:", error);
	}
};
</script>

  <style scoped>

  </style>
