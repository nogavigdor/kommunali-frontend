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
				<Icon
					name="uil:times"
					class="text-xl" />
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
					:selected-shop-id="shop?._id"
					:editable="isEditable"
					:product="product" />
			</swiper-slide>
		</swiper>
		<button
			v-if="isEditable"
			class="btn-primary"
			@click="openModal = !openModal">
			Add Product
		</button>
		<div class="mt-4">
			<button
				class="flex items-center gap-2 btn-primary w-full justify-center py-3"
				@click="openChat">
				<Icon
					name="uil:comment-dots"
					class="w-6 h-6 text-white" />
				<span>Chat with Shop Owner</span>
			</button>
			<client-only>
				<ChatBox
					v-if="shop && showChat"
					:selected-shop-id="shop._id"
					:chat-id="chatId"
					@close="showChat = false" />
			</client-only>
		</div>
		<div class="mb-4">
			<ProductAddModal v-model="openModal" />
		</div>
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

const openModal = ref(false);

const props = defineProps({
	selectedShopId: {
		type: String,
		required: true,
	},
	style: {
		type: Object,
		required: true,
	},
});

const chatId = computed(() => {
	return userStore.getChatId(props.selectedShopId);
});

const showChat = ref(false);

const openChat = () => {
	showChat.value = !showChat.value;
};

console.log("The shop id is: ", props.selectedShopId);
console.log("The user store is: ", userStore);

// commeneted since the computed didn't work effectively - it tracked tracked the existence of the shop
// or products but not the shop details - fo example deletion or changes in title or description
// const shop = computed(() => {
//	return shopsStore.shops.find((shop: IShop) => shop._id === props.selectedShopId) || shopsStore.userShop?.products || null;
// });

// whenever there is a change within the selected shop details, the shop will be updated
const shop = computed(() => shopsStore.shops.find((shop: IShop) => shop._id === props.selectedShopId));

watch(
	() => shopsStore.userShop?.products || [],
	(updatedProducts) => {
		console.log("Products updated in ShopDetails:", updatedProducts);
	},
	{ immediate: true, deep: true },
);
const _emit = defineEmits(["close"]);

const isEditable = computed(() => {
	return userStore.user && userStore.shopIds.includes(props.selectedShopId);
});
</script>

  <style scoped>
    .overflow-x-auto {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch; /* Enables smooth scrolling on iOS devices */
}
  </style>
