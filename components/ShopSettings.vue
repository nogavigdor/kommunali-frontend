<template>
	<div class="p-6">
		<h2 class="text-xl font-bold mb-4 text-brandPrimary-500">
			Shop Settings
		</h2>
		<div class="mb-4">
			<ShopEdit />
			<div class="mb-4">
				<swiper
					:slides-per-view="5.5"
					space-between="10"
					:grab-cursor="true"
					class="mt-4 pb-4">
					<swiper-slide
						v-for="product in shop?.products"
						:key="product._id">
						<ProductDetails
							:selected-shop-id="shop?._id"
							:editable="isEditable"
							:product="product" />
					</swiper-slide>
				</swiper>
			</div>
			<button
				class="btn-primary"
				@click="addProduct">
				Add Product
			</button>
			<div class="mb-4">
				<ProductAddModal v-model="openModal" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { useUserStore } from "@/stores/user";
import { useShopsStore } from "@/stores/shops";
import type { IProduct } from "@/types/product";
import "swiper/swiper-bundle.css"; // Import Swiper styles;
import { select } from "firebase-functions/params";

const userStore = useUserStore();
const shopsStore = useShopsStore();
const userShop = computed(() => shopsStore.userShop);
const shop = computed(() => userShop.value);

const openModal = ref(false);

// Check if the user is logged in and has a shop -
// by searching for the shop ID in the user's shop IDs
const isEditable = computed(() => !!(userStore.loggedIn && shop.value?._id
	&& userStore.shopIds.includes(shop.value._id)));

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
		openModal.value = !openModal.value;
	}
	catch (error) {
		console.error("Failed to add product:", error);
	}
};
</script>

  <style scoped>

  </style>
