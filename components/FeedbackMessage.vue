<template>
	<div
		v-if="showFeedback"
		:class="feedbackClass"
		class="fixed top-0 left-0 right-0 p-4 flex justify-between items-center">
		<span>{{ currentFeedback?.message }}</span>
		<button
			class="text-neutral-dark"
			@click="clearFeedback">
			X
		</button>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useFeedbackStore } from "~/stores/feedback";

const feedbackStore = useFeedbackStore();

const showFeedback = computed(() => feedbackStore.showFeedback);
const currentFeedback = computed(() => feedbackStore.currentFeedback);

const feedbackClass = computed(() => {
	switch (currentFeedback.value?.type) {
		case "success":
			return "bg-success-light text-success-dark border-l-4 border-success";
		case "alert":
			return "bg-alert-light text-alert-dark border-l-4 border-alert";
		case "error":
		default:
			return "bg-error-light text-error-dark border-l-4 border-error";
	}
});

const clearFeedback = () => {
	feedbackStore.clearFeedback();
};
</script>

  <style scoped>
  .fixed {
    z-index: 50;
  }
  </style>
