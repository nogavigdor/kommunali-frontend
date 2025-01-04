<template>
	<footer class="bg-brandPrimary-500 text-white py-8">
		<div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
			<!-- Logo and Address Section -->
			<div class="text-center md:text-left mb-4 md:mb-0">
				<h1 class="text-xl font-heading">
					Kommunali
				</h1>
				<p class="mt-2 text-text">
					Kløvervej 35, 4.th, 6000 Kolding
				</p>
			</div>

			<!-- Social Media Links Section -->
			<div class="flex space-x-6 mb-4 md:mb-0">
				<a
					href="https://facebook.com/kommunali"
					target="_blank"
					class="hover:text-accent">
					<span class="sr-only">Facebook</span>
					<i class="fab fa-facebook" />
				</a>
				<a
					href="https://instagram.com/kommunali"
					target="_blank"
					class="hover:text-accent">
					<span class="sr-only">Instagram</span>
					<i class="fab fa-instagram" />
				</a>
				<a
					href="https://youtube.com/kommunali"
					target="_blank"
					class="hover:text-accent">
					<span class="sr-only">YouTube</span>
					<i class="fab fa-youtube" />
				</a>
				<a
					href="mailto:info@kommunali.com"
					class="hover:text-accent">
					<span class="sr-only">Email</span>
					<i class="fas fa-envelope" />
				</a>
			</div>

			<!-- Navigation Links Section -->
			<nav class="flex flex-wrap justify-center space-x-4 text-center md:text-right">
				<NuxtLink
					to="/"
					class="hover:text-secondary">
					Home
				</NuxtLink>
				<NuxtLink
					to="#"
					class="hover:text-secondary">
					About
				</NuxtLink>
				<NuxtLink
					to="/faq"
					class="hover:text-secondary">
					FAQ
				</NuxtLink>
				<NuxtLink
					to="#"
					class="hover:text-secondary">
					Contact
				</NuxtLink>
			</nav>
		</div>

		<!-- Bottom Bar -->
		<div class="text-center text-sm mt-6 border-t border-brandGray-700 pt-4">
			<p class="text-text">
				&copy; {{ new Date().getFullYear() }} Kommunali. All Rights Reserved.
			</p>
		</div>
	</footer>
</template>

<script setup>
// No additional logic needed here for a static footer
</script>

  <style scoped>
  footer a {
    @apply transition-all duration-300;
  }
  </style>
