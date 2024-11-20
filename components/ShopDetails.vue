<!-- ShopDetails.vue -->
<template>
	<div
		class="absolute bottom-0 left-0 w-300 h-60 bg-white p-4 shadow-medium rounded-t-2xl z-20"
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
		<div class="overflow-x-auto flex gap-4 mt-4">
			<div
				v-for="product in shop.products"
				:key="product._id"
				class=" min-w-[50px] border border-brandNeutral-dark rounded-lg p-2 shadow-soft">
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
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
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

  </style>
