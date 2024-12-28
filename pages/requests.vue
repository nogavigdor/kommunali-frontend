<template>
	<div class="page-transition">
		<div class="flex justify-between items-center mb-4">
			<h1 class="text-4xl font-bold text-left">
				Requests Page
			</h1>
			<ToLink
				link="/"
				icon="arrow-left"
				tooltip-text="Back to Home Page" />
		</div>
		<p class="mt-4 text-lg">
			Manage requests from other users.
		</p>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: "auth",
	title: "Requests",
	requiresUserAuth: true,
	meta: [
		{
			name: "description",
			content: "Manage requests from other users.",
		},
	],
});
</script>
