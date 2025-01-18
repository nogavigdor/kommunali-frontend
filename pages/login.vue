<template>
	<div class="min-h-screen flex bg-gradient-to-br from-brandPrimary-500 to-brandPrimary-800 text-white">
		<!-- Left Column -->
		<div class="flex-1 flex items-center justify-center bg-white text-gray-900 px-8 py-12 rounded-lg shadow-lg">
			<LoginForm />
		</div>

		<!-- Right Column	-->
		<div class="hidden md:flex flex-1 items-center justify-center">
			<img
				src="@/assets/images/img2.jpg"
				alt="Branding"
				class="max-w-full h-auto rounded-lg shadow-lg">
		</div>
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
