import { ref } from "vue";
import { defineStore } from "pinia";
import { useFirebaseAuth } from "vuefire";
import { useUserStore } from "./user";
import type { IShop } from "@/types/shop";
import type { IProduct } from "@/types/product";
import type { ILocationQuery } from "~/types/locationQuery";

export const useShopsStore = defineStore("shops", () => {
	const config = useRuntimeConfig();
	const shops = ref<IShop[]>([]);
	const userShop = ref<IShop | null>(null);
	const currentProduct = ref<IProduct | null>(null);
	const highlightedShops = ref<string[]>([]);
	const auth = useFirebaseAuth();

	// Fetch shops within bounds based on user location
	async function getShops(bounds: ILocationQuery) {
		try {
			console.log("Fetching shops with bounds:", bounds);
			const response = await $fetch(`${config.public.apiBaseUrl}/api/stores/stores-in-bounds`,
				{
					headers: {
						"Content-Type": "application/json",
					},
					method: "POST",
					body: bounds,
				},
			);

			// Assuming response is an array of shops
			shops.value = response as IShop[];
		}
		catch (error) {
			console.error("Error fetching shops:", error);
		}
	}

	async function getUserShop(shopId: string) {
		try {
			if (!auth || !auth.currentUser) {
				throw new Error("No authenticated user found");
			}
			const token = await auth.currentUser.getIdToken();
			const response = await $fetch(`${config.public.apiBaseUrl}/api/stores/${shopId}`, {
				method: "GET",
				headers: {

					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
				},

			},
			);
			userShop.value = response as IShop;
		}
		catch (error) {
			console.error("Failed to fetch user shop:", error);
		}
	}

	async function createShop(newShop: Omit<IShop, "_id" | "ownerFirebaseId">) {
		try {
			const user = auth?.currentUser;
			if (!user) throw new Error("User not authenticated");

			const token = await user.getIdToken();
			const response = await $fetch(`${config.public.apiBaseUrl}/api/stores`, {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: newShop,
			});
			shops.value.push(response as IShop);
			useUserStore().shopIds.push((response as IShop)._id);
			userShop.value = response as IShop;
			useUserStore().userLocation = newShop.location.coordinates;
		}
		catch (error) {
			console.error("Failed to add shop:", error);
		}
	}

	async function addProduct(newProduct: IProduct) {
		try {
			if (!auth) throw new Error("Firebase Auth not initialized");
			const user = auth.currentUser;
			if (!user) throw new Error("User not authenticated");

			const token = await user.getIdToken();
			const response = await $fetch(`${config.public.apiBaseUrl}/api/stores/${userShop.value?._id}/products`, {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: newProduct,
			});
			const addedProduct = response as IProduct;

			// Update `userShop` with a new products array
			if (userShop.value) {
				userShop.value = {
					...userShop.value,
					products: [...userShop.value.products, addedProduct],
				};
			}

			// Update the `shops` array with a new `products` array
			shops.value = shops.value.map((shop) => {
				if (shop._id === userShop.value?._id) {
					return {
						...shop,
						products: [...shop.products, addedProduct],
					};
				}
				return shop;
			});
			console.log("Product added and the updated shops in store are:", shops.value);
		}
		catch (error) {
			console.error("Failed to add product:", error);
		}
	};

	async function updateShop(updatedShop: Partial<IShop> & { _id: string }) {
		try {
			const user = auth?.currentUser;
			if (!user) throw new Error("User not authenticated");

			const token = await user.getIdToken();
			const response = await $fetch(`${config.public.apiBaseUrl}/api/stores/${updatedShop._id}`, {
				method: "PUT",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: updatedShop,
			});
			const index = shops.value.findIndex(shop => shop._id === (response as IShop)._id);
			shops.value[index] = response as IShop;
			userShop.value = response as IShop;
			useUserStore().userLocation = userShop.value?.location.coordinates;
		}
		catch (error) {
			console.error("Failed to update shop:", error);
		}
	}

	async function updatProduct(updatedProduct: IProduct) {
		try {
			const user = auth?.currentUser;
			if (!user) throw new Error("User not authenticated");

			const token = await user.getIdToken();
			const response = await $fetch(`${config.public.apiBaseUrl}/api/stores/${userShop.value?._id}/products/${updatedProduct._id}`, {
				method: "PUT",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: updatedProduct,
			});
			const index = userShop.value?.products.findIndex(product => product._id === (response as IProduct)._id);
			if (index !== undefined && index !== -1) {
				userShop.value!.products[index] = response as IProduct;
			}
			// find the shop which its product was updated in thee shops array in order
			// to keep them updated.
			shops.value = shops.value.map((shop) => {
				if (shop._id === userShop.value?._id) {
					// create a new array of products with the updated product
					shop.products = shop.products.map(product => product._id === (response as IProduct)._id ? (response as IProduct) : product);
				}
				return shop;
			},
			);
		}
		catch (error) {
			console.error("Failed to update product:", error);
		}
	}

	async function deleteProduct(productId: string) {
		try {
			const user = auth?.currentUser;
			if (!user) throw new Error("User not authenticated");

			const token = await user.getIdToken();
			await $fetch(`${config.public.apiBaseUrl}/api/stores/${userShop.value?._id}/products/${productId}`, {
				method: "DELETE",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			userShop.value!.products = userShop.value!.products.filter(product => product._id !== productId);
			// find the shop which its product was deleted in thee shops array in order
			// to keep them updated.
			shops.value = shops.value.map((shop) => {
				if (shop._id === userShop.value?._id) {
					// create a new array of products without the deleted product
					shop.products = shop.products.filter(product => product._id !== productId);
				}
				return shop;
			});
		}
		catch (error) {
			console.error("Failed to delete product:", error);
		}
	}

	// get product from a specific shop - not necessarily from the user shop
	async function getProduct(newProduct: IProduct) {
		try {
			const response = await $fetch(`${config.public.apiBaseUrl}/api/stores/${userShop.value?._id}/products`, {
				method: "GET",
				headers: {

					"Content-Type": "application/json",
				},
				body: newProduct,
			});
			currentProduct.value = response as IProduct;
		}
		catch (error) {
			console.error("Failed to add product:", error);
		}
	};

	// accepts the productId and type of action(request or cancel)as as parameters
	async function addProductRequest(selectedShopId: string, productId: string, action: "request" | "cancel") {
		try {
			const user = auth?.currentUser;
			if (!user) throw new Error("User not authenticated");

			const token = await user.getIdToken();

			// Validate action
			if (!["request", "cancel"].includes(action)) {
				console.error("Invalid action:", action);
				return;
			}
			const response = await $fetch(`${config.public.apiBaseUrl}/api/stores/${selectedShopId}/products/${productId}/request`, {
				method: "PUT",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: { action },
			});
			const updatedProduct = response as IProduct;
			// Update the shop where the product was requested
			// with its updated product -which contains the updated requestQueue

			shops.value = shops.value.map((shop) => {
				if (shop._id === selectedShopId) {
					return {
						...shop,
						products: shop.products.map(product => product._id === updatedProduct._id ? updatedProduct : product),
					};
				}
				return shop;
			});
			// let selectedProduct = shops.value.find(shop => shop._id === selectedShopId)?.products.find(product => product._id === productId);
			// if (selectedProduct) selectedProduct = updatedProduct;

			// update the user in the user store with its
			// updated request products array
			const userStore = useUserStore();
			if (userStore.user) {
				// updates the user's requested products array with the updated product
				if (action === "request") {
					userStore.user.requested_products.push({ product: productId, store: selectedShopId });
				}
				else if (action === "cancel") {
					userStore.user.requested_products = userStore.user.requested_products.filter(product => product.product !== productId);
				}
			}
		}
		catch (error) {
			console.error("Failed to request product:", error);
		}
	}

	// Cancel a request for a product
	/*
	async function cancelRequest(productId: string) {
		try {
			const user = auth?.currentUser;
			if (!user) throw new Error("User not authenticated");

			const token = await user.getIdToken();
			const response = await $fetch(`${config.public.apiBaseUrl}/api/stores/${userShop.value?._id}/products/${productId}/request`, {
				method: "DELETE",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			const updatedProduct = response as IProduct;
			// Update `userShop` with a new products array
			if (userShop.value) {
				userShop.value = {
					...userShop.value,
					products: userShop.value.products.map(product => product._id === updatedProduct._id ? updatedProduct : product),
				};
			}

			// Update the `shops` array with a new `products` array
			shops.value = shops.value.map((shop) => {
				if (shop._id === userShop.value?._id) {
					return {
						...shop,
						products: shop.products.map(product => product._id === updatedProduct._id ? updatedProduct : product),
					};
				}
				return shop;
			});
		}
		catch (error) {
			console.error("Failed to cancel request:", error);
		}
	}
	*/
	// get product from userShop state in this store

	function getUserShopProduct(productId: string) {
		if (userShop.value) {
			return userShop.value.products.find(product => product._id === productId);
		}
	}

	// get product from  shops state in this store
	function getShopById(shopId: string) {
		return shops.value.find(shop => shop._id === shopId);
	}

	// Computed property to get the number of shops fetched
	const shopCount = computed(() => shops.value.length);

	function setHighlightedShops(highlightedShopIds: string[]) {
		highlightedShops.value = highlightedShopIds;
	}

	function getHighlightedShops() {
		return highlightedShops.value;
	}

	return {
		shops,
		getShops,
		getUserShop,
		getShopById,
		createShop,
		getProduct,
		getUserShopProduct,
		addProduct,
		updatProduct,
		updateShop,
		deleteProduct,
		userShop,
		shopCount,
		setHighlightedShops,
		getHighlightedShops,
		highlightedShops,
		addProductRequest,
	};
});
