<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
// force light mode using nuxt ui
const colorMode = useColorMode();
colorMode.preference = "light";
</script>
