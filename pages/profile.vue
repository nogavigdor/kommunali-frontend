<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold">
			Profile Page
		</h1>
		<p>View and edit profile information.</p>
	</div>
</template>

<script setup  lang="ts">
definePageMeta({
	middleware: "auth",
	title: "Profile",
	requiresUserAuth: true,
	meta: [
		{
			name: "description",
			content: "View and edit profile information.",
		},
	],
});
</script>
