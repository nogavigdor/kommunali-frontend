<template>
	<div class="auth-layout">
		<NuxtPage />
		<button @click="goToHome">
			Go to Homepage
		</button>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const goToHome = () => {
	useRouter().push("/");
};
</script>
