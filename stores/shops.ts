import { ref } from "vue";
import { defineStore } from "pinia";
import { useFirebaseAuth } from "vuefire";
import type { IShop } from "@/types/shop";
import type { IProduct } from "@/types/product";
import type { ILocationQuery } from "~/types/locationQuery";

export const useShopsStore = defineStore("shops", () => {
	const config = useRuntimeConfig();
	const shops = ref<IShop[]>([]);
	const userShop = ref<IShop | null>(null);
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
			if (!auth) throw new Error("Firebase Auth not initialized");
			const user = auth.currentUser;
			if (!user) throw new Error("User not authenticated");

			const token = await user.getIdToken();
			const response = await $fetch(`/api/stores/${shopId}`, {
				headers: {
					"method": "GET",
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

	async function addProduct(newProduct: IProduct) {
		try {
			if (!auth) throw new Error("Firebase Auth not initialized");
			const user = auth.currentUser;
			if (!user) throw new Error("User not authenticated");

			const token = await user.getIdToken();
			const response = await $fetch(`/api/stores/${userShop.value?._id}/products`, {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: newProduct,
			});
			userShop.value?.products.push(response as IProduct);
		}
		catch (error) {
			console.error("Failed to add product:", error);
		}
	};

	async function updateShop(updatedShop: IShop) {
		try {
			const user = auth?.currentUser;
			if (!user) throw new Error("User not authenticated");

			const token = await user.getIdToken();
			const response = await $fetch(`/api/stores/${updatedShop._id}`, {
				method: "PUT",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: updatedShop,
			});
			const index = shops.value.findIndex(shop => shop._id === response._id);
			shops.value[index] = response as IShop;
		}
		catch (error) {
			console.error("Failed to update shop:", error);
		}
	}

	async function deleteProduct(productId: string) {
		try {
			const user = auth?.currentUser;
			if (!user) throw new Error("User not authenticated");

			const token = await user.getIdToken();
			await $fetch(`/api/stores/${userShop.value?._id}/products/${productId}`, {
				method: "DELETE",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			userShop.value!.products = userShop.value!.products.filter(product => product._id !== productId);
		}
		catch (error) {
			console.error("Failed to delete product:", error);
		}
	}

	// Computed property to get the number of shops fetched
	const shopCount = computed(() => shops.value.length);

	return {
		shops,
		getShops,
		getUserShop,
		addProduct,
		updateShop,
		deleteProduct,
		userShop,
		shopCount,
	};
});
