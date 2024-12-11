<template>
	<div class="p-6">
		<h2 class="text-xl font-bold mb-4 text-brandPrimary-500">
			Shop Management
		</h2>
		<div v-if="!hasShop">
			<button
				v-if="!showNewShopForm"
				class="w-full bg-brandPrimary-500 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-brandPrimary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandPrimary-500"
				@click="showNewShopForm = true">
				Add Shop
			</button>
			<ShopNew
				v-if="showNewShopForm && loggedIn"
				@shop-created="handleShopCreated" />
		</div>
		<div v-else>
			<ShopSettings />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../stores/user";
import { useShopsStore } from "../stores/shops";

definePageMeta({
	middleware: "auth",
	title: "Shop",
	requiresUserAuth: true,
	meta: [
		{
			name: "description",
			content: "Manages shop and products.",
		},
	],
});

const userStore = useUserStore();
const shopStore = useShopsStore();

const hasShop = computed(() => userStore.hasShop);
const loggedIn = computed(() => userStore.loggedIn);
const showNewShopForm = ref(false);

const handleShopCreated = () => {
	// Update the user store with the new shop details
	shopStore.getUserShop(userStore.user.stores[0]);
	userStore.hasShop = true;
	console.log("The shop details are: ", userStore.shop);
	showNewShopForm.value = false;
};
</script>

  <style scoped>

  </style>
