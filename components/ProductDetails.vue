<template>
	<div />
</template>

<script setup lang="ts">
import { useShopsStore } from "@/stores/shops";
import type { IProduct } from "@/types/product";

const props = defineProps<{
	productId: string;
}>();

const shopsStore = useShopsStore();
const product = ref<IProduct | null>(null);

product.value = shopsStore.getUserShopProduct(props.productId) || null;
</script>

<style scoped>
</style>
