<template>
	<div class="page-transition">
		<div class="flex justify-between items-center mb-4">
			<h1 class="text-2xl font-bold">
				Messages Page
			</h1>
			<ToLink
				link="/"
				icon="arrow-left"
				tooltip-text="Back to Home Page" />
		</div>
		<p>View and manage your messages history.</p>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: "auth",
	title: "Messages",
	requiresUserAuth: true,
	meta: [
		{
			name: "description",
			content: "View and manage your messages history.",
		},
	],
});
</script>
