import { ref } from "vue";
import { defineStore } from "pinia";
import type { IShop } from "@/types/shop";

export const useShopsStore = defineStore("shops", () => {
	const config = useRuntimeConfig();
	const shops = ref<IShop[]>([]);
	const userLocation = ref<[number, number]>([0, 0]);

	// Fetch shops within bounds based on user location
	async function getShops() {
		try {
			const response = await $fetch(`${config.public.apiBaseUrl}/api/stores/stores-in-bounds`,
				{
					headers: {
						"Content-Type": "application/json",
					},
					method: "POST",
					body: {
						bottomLeft: [userLocation.value[0] - 0.01, userLocation.value[1] - 0.01],
						topRight: [userLocation.value[0] + 0.01, userLocation.value[1] + 0.01],
					},
				},
			);

			// Assuming response is an array of shops
			shops.value = response as IShop[];
		}
		catch (error) {
			console.error("Error fetching shops:", error);
		}
	}

	// Computed property to get the number of shops fetched
	const shopCount = computed(() => shops.value.length);

	return {
		shops,
		userLocation,
		getShops,
		shopCount,
	};
});
