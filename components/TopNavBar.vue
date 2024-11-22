<!-- TopNavbar.vue -->
<template>
	<nav class="bg-primary text-white">
		<div class="flex justify-between items-center w-full">
			<!-- Left Side - Menu Icon -->
			<button
				class="ml-4"
				@click="$emit('toggle-menu')">
				<UIcon
					:name="open?'i-heroicons-x-mark':'i-heroicons-bars-3'"
					class="absolute text-xl z-20 top-5 left-5 text-white" />
			</button>

			<!-- Register Button (Center) -->
			<div class="flex-grow text-center">
				<button
					class="btn-secondary"
					@click="goToRegisterPage">
					Register
				</button>
			</div>
			<!-- Right Side - Search Icon -->
			<button class="mr-4">
				<UIcon
					name="i-heroicons-magnifying-glass"
					class="text-xl text-white" />
				<UTooltip>Search</UTooltip>
			</button>
		</div>
	</nav>
</template>

<script setup lang="ts">
defineProps({
	open: Boolean,
});
defineEmits(["toggle-menu"]);

const router = useRouter();

// Function to navigate to the registration page
const goToRegisterPage = () => {
	router.push("/registration");
};
</script>
