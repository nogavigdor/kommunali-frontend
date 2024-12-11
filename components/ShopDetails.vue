<!-- ShopDetails.vue -->
<template>
	<div
		class="absolute bottom-0 left-0 w-96 h-96 bg-white p-4 shadow-medium rounded-2xl z-20"
		:style="style">
		<div class="flex items-center justify-between">
			<h2 class="text-2xl font-heading text-brandPrimary-700">
				{{ shop?.name }}
			</h2>
			<button
				class="text-red-500 hover:text-red-700"
				@click="$emit('close')">
				Close
			</button>
		</div>
		<p class="text-brandNeutral-dark">
			{{ shop?.description }}
		</p>
		<swiper
			:slides-per-view="1.5"
			space-between="10"
			:grab-cursor="true"
			class="mt-4 pb-4">
			<swiper-slide

				v-for="product in shop?.products"
				:key="product._id">
				<ProductDetails
					:editable="isEditable"
					:product="product" />
			</swiper-slide>
		</swiper>
	</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css"; // Import Swiper styles;
import { useUserStore } from "@/stores/user";
import { useShopsStore } from "@/stores/shops";
import type { IShop } from "@/types/shop";

const userStore = useUserStore();
const shopsStore = useShopsStore();

const props = defineProps({
	shopId: {
		type: String,
		required: true,
	},
	style: {
		type: Object,
		required: true,
	},
});

console.log("The shop id is: ", props.shopId);
console.log("The user store is: ", userStore);
const shop = computed(() => {
	return shopsStore.shops.find((shop: IShop) => shop._id === props.shopId) || null;
});
const _emit = defineEmits(["close"]);

const isEditable = computed(() => {
	return userStore.user && userStore.shopIds.includes(props.shopId);
});
</script>

  <style scoped>
    .overflow-x-auto {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch; /* Enables smooth scrolling on iOS devices */
}
  </style>
