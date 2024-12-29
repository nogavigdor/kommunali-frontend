<template>
	<UTooltip :text="tooltipText">
		<NuxtLink
			:to="link"
			class=" hover:text-green-700"
			aria-label="Back to Home Page">
			<Icon
				:name="'uil:' + icon"
				class="
				text-4xl
				font-bold
				hover:text-green-700" />
		</NuxtLink>
	</UTooltip>
</template>

<script setup lang="ts">
defineProps<{
	link: string;
	icon: string;
	tooltipText?: string; // Optional prop for the tooltip text
}>();
</script>
