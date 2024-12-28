<template>
	<div class="page-transition">
		<div class="flex justify-between items-center mb-4">
			<h1 class="text-2xl font-bold">
				Settings Page
			</h1>
			<ToLink
				link="/"
				icon="arrow-left"
				tooltip-text="Back to Home Page" />
		</div>
		<p>Here one can configure the application settings.</p>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: "auth",
	title: "Settings",
	requiresUserAuth: true,
	meta: [
		{
			name: "description",
			content: "Here one can configure the application settings.",
		},
	],
});
</script>
