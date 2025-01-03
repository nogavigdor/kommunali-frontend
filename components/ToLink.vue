<template>
	<UTooltip :text="tooltipText">
		<NuxtLink
			:to="link"
			class=" link2 "
			aria-label="Back to Home Page">
			<Icon
				:name="'uil:' + icon"
				class="
				text-4xl
				font-bold
			" />
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
