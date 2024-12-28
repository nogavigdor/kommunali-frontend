<template>
	<UTooltip text="props.tooltipText">
		<button

			class=" hover:text-green-700"
			aria-label="Back to Home Page"
			@click="toLink">
			<Icon
				:name="'uil:' + props.icon"
				class="
				text-4xl
				font-bold
				hover:text-green-700" />
		</button>
	</UTooltip>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const props = defineProps<{
	link: string;
	icon: string;
	tooltipText?: string; // Optional prop for the tooltip text
}>();

const router = useRouter();

const toLink = () => {
	router.push(props.link);
};
</script>
