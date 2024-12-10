<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold">
			Wishlist Page
		</h1>
		<p>View and manage items one wish to buy.</p>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: "auth",
	title: "Wishlist",
	requiresUserAuth: true,
	meta: [
		{
			name: "description",
			content: "View and manage items one wish to buy.",
		},
	],
});
</script>
