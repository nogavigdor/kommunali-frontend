<!-- TopNavbar.vue -->
<template>
	<UAppBar class="bg-primary text-white">
		<div class="flex justify-between items-center w-full">
			<!-- Left Side - Menu Icon -->
			<button
				class="ml-4"
				@click="$emit('toggle-menu')">
				<UIcon
					name="menu"
					class="text-xl text-white" />
			</button>
			<!-- Right Side - Search Icon -->
			<button class="mr-4">
				<UIcon
					name="search"
					class="text-xl text-white" />
				<UTooltip>Search</UTooltip>
			</button>
		</div>
	</UAppBar>
</template>

<script setup>
const _emit = defineEmits(["toggle-menu"]);
</script>
