import { ref } from "vue";
import { defineStore } from "pinia";
import type { IShop } from "@/types/shop";

const config = useRuntimeConfig();

export const useShopsStore = defineStore("shops", () => {
	const shops = ref<IShop[]>([]);

	const userLocation = ref<[number, number]>([0, 0]);

	async function getShops() {
		shops.value = await $fetch(`${config.public.apiBaseUrl}/api/stores/stores-in-bounds`,
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
	}

	return {
		shops,
		getShops,
	};
});
