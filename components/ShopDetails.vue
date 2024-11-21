<!-- ShopDetails.vue -->
<template>
	<div
		class="absolute bottom-0 left-0 w-96 h-96 bg-white p-4 shadow-medium rounded-2xl z-20"
		:style="style">
		<div class="flex items-center justify-between">
			<h2 class="text-2xl font-heading text-brandPrimary-700">
				{{ shop.name }}
			</h2>
			<button
				class="text-red-500 hover:text-red-700"
				@click="$emit('close')">
				Close
			</button>
		</div>
		<p class="text-brandNeutral-dark">
			{{ shop.description }}
		</p>
		<swiper
			:slides-per-view="1.5"
			space-between="10"
			:grab-cursor="true"
			class="mt-4 pb-4">
			<swiper-slide
				v-for="product in shop.products"
				:key="product._id"
				class=" min-w-[150px] max-w-xs  border border-neutral-dark rounded-lg p-2 shadow-soft">
				<img
					:src="placeholderImage"
					alt="Product Image"
					class="w-full h-32 object-cover rounded-lg">
				<h3 class="text-lg font-heading mt-2">
					{{ product.name }}
				</h3>
				<p class="text-brandSecondary-dark">
					{{ product.price }} DKK
				</p>
			</swiper-slide>
		</swiper>
	</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css"; // Import Swiper styles
import imagePlaceholder from "@/assets/images/image-placeholder.webp";

const _props = defineProps({
	shop: {
		type: Object,
		required: true,
	},
	style: {
		type: Object,
		required: true,
	},
});

const _emit = defineEmits(["close"]);
const placeholderImage = imagePlaceholder;
</script>

  <style scoped>
    .overflow-x-auto {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch; /* Enables smooth scrolling on iOS devices */
}
  </style>
