<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold">
			Requests Page
		</h1>
		<p>Manage requests from other users.</p>
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
