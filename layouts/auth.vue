<template>
	<div class="min-h-screen flex items-center justify-center bg-primary p-6">
		<!-- Left Side Section for Homepage Button -->
		<div class="absolute top-8 left-8">
			<button 
				@click="goToHome"
				class="bg-white text-primary font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-secondary-dark hover:text-white transition-all duration-300">
				← Go to Homepage
			</button>
		</div>

		<!-- Center Content Section -->
		<div class="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl">
			<FeedbackMessage />
			<NuxtPage />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goToHome = () => {
	router.push("/");
};
</script>
