<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold">
			Messages Page
		</h1>
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
