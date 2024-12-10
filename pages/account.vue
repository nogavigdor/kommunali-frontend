<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold">
			Account Page
		</h1>
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
