<template>
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-brandPrimary-500 to-brandPrimary-800 text-white py-12 px-6 lg:px-8">
		<RegistrationForm />
	</div>
</template>

<script setup lang="ts">
definePageMeta ({
	layout: "auth",
	title: "Registration",
	meta: [
		{
			name: "description",
			content: "Register for a new account on Kommunali.",
		},
	],
});
</script>

  <style scoped>

  </style>
