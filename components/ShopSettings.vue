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
import "swiper/swiper-bundle.css"; // Import Swiper styles;

const userStore = useUserStore();
const shopsStore = useShopsStore();
const userShop = computed(() => shopsStore.userShop);
const shop = computed(() => userShop.value);

const openModal = ref(false);

// Check if the user is logged in and has a shop -
// by searching for the shop ID in the user's shop IDs
const isEditable = computed(() => !!(userStore.loggedIn && shop.value?._id
	&& userStore.shopIds.includes(shop.value._id)));

const addProduct = () => {
	openModal.value = !openModal.value;
};
</script>

  <style scoped>

  </style>
