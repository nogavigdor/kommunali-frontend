<template>
	<div class="page-transition">
		<div class="flex justify-between items-center mb-4">
			<h1 class="text-2xl font-bold">
				Wishlist Page
			</h1>
			<ToLink
				link="/"
				icon="arrow-left"
				tooltip-text="Back to Home Page" />
		</div>
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
