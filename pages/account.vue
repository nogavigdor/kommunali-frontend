<template>
	<div class="p-6">
		<div class="flex justify-between items-center mb-4">
			<h1 class="text-2xl font-bold">
				Account Page
			</h1>
			<ToLink
				link="/"
				icon="arrow-left"
				tooltip-text="Back to Home Page" />
		</div>
		<p>Manage account details here.</p>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: "auth",
	title: "Account",
	requiresUserAuth: true,
	meta: [
		{
			name: "description",
			content: "Manage account details here.",
		},
	],
});
</script>
