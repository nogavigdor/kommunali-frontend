<template>
	<div class="p-6">
		<h2 class="text-xl font-bold mb-4 text-brandPrimary-500">
			Shop Settings
		</h2>
		<div class="mb-4">
			<ShopEdit />
			<div class="mb-4">
				<swiper
					:slides-per-view="1.5"
					space-between="10"
					:grab-cursor="true"
					:modules="[Pagination]"
					:pagination="{ clickable: true }"
					:breakpoints="{
						640: { slidesPerView: 1.2, spaceBetween: 8 }, // Small screens
						768: { slidesPerView: 2.5, spaceBetween: 10 }, // Medium screens
						1024: { slidesPerView: 3, spaceBetween: 15 }, // Large screens
					}"
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
import { Pagination } from "swiper/modules";
import { ref, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { useUserStore } from "@/stores/user";
import { useShopsStore } from "@/stores/shops";
import "swiper/swiper-bundle.css"; // Import Swiper styles

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

onMounted(() => {
	const paginationElement = document.querySelector(".swiper-pagination");
	if (paginationElement instanceof HTMLElement) {
		// Ensure the selected element is an HTML element
		paginationElement.style.position = "relative";
		paginationElement.style.paddingTop = "10px"; // Add padding above bullets
	}
	else {
		console.warn(".swiper-pagination element not found or not an HTML element");
	}
});
</script>

  <style scoped>

  </style>
