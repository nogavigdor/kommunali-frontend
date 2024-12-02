<template>
	<div class="p-6">
		<h2 class="text-xl font-bold mb-4 text-brandPrimary-500">
			Shop Settings
		</h2>
		<div class="mb-4">
			<h3 class="text-lg font-semibold">
				Shop Details
			</h3>
			<div>
				<label><strong>Name:</strong></label>
				<EditField
					:value="userShop?.name"
					field="name"
					@update-field="updateShopField" />
			</div>
			<div>
				<label><strong>Description:</strong></label>
				<EditField
					:value="userShop?.description"
					field="description"
					@update-field="updateShopField" />
			</div>
			<div>
				<label><strong>Address:</strong></label>
				<EditField
					:value="userShop?.address.street"
					field="address.street"
					@update-field="updateShopField" />
				<EditField
					:value="userShop?.address.houseNumber"
					field="address.houseNumber"
					@update-field="updateShopField" />
				<EditField
					:value="userShop?.address.city"
					field="address.city"
					@update-field="updateShopField" />
				<EditField
					:value="userShop?.address.postalCode"
					field="address.postalCode"
					@update-field="updateShopField" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useShopsStore } from "@/stores/shops";
import EditField from "@/components/EditField.vue";
import type { IShop } from "~/types/shop";

const shopsStore = useShopsStore();
const userShop = computed(() => shopsStore.userShop);

async function updateShopField({ field, value }: { field: keyof IShop; value: string }) {
	if (userShop.value) {
		const updatedData = { [field]: value, _id: userShop.value._id } as Partial<IShop> & { _id: string };

		try {
			await shopsStore.updateShop(updatedData);
			console.log("Shop updated successfully");
		}
		catch (error) {
			console.error("Error updating shop:", error);
		}
	}
}
</script>

  <style scoped>
    /* Add any required styles here */
  </style>
