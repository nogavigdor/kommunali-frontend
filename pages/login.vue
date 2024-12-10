<template>
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-brandPrimary-500 to-brandPrimary-800 text-white py-12 px-6 lg:px-8">
		<LoginForm />
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	layout: "auth",
	title: "Login",
	meta: [
		{
			name: "description",
			content: "Login to your account on Kommunali.",
		},
	],
});
</script>

  <style scoped>

  </style>
