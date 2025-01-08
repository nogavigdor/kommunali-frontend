<template>
	<div
		v-if="showFeedback"
		:class="['fixed top-0 left-0 right-0 p-4 flex justify-between items-center shadow-medium z-50', feedbackClass]"
		role="alert">
		<div class="flex items-center gap-3">
			<!-- Feedback Icon -->
			<Icon
				:class="['w-10 h-10', iconClass]"
				:name="iconName" />
			<span class="text-2xl font-medium">
				{{ currentFeedback?.message }}
			</span>
		</div>
		<!-- Dismiss Button -->
		<button
			class="text-brandGray-800 hover:text-brandGray-800 transition duration-200"
			aria-label="Dismiss Feedback"
			@click="clearFeedback">
			<Icon
				name="uil:times-circle"
				class="w-10 h-10 text-brandPrimary-950" />
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
			return "bg-success-dark text-brandGray-800 border-l-4 border-success";
		case "alert":
			return "bg-alert-light text-text-dark border-l-4 border-alert";
		case "error":
		default:
			return "bg-error-dark text-brandGray-100 border-l-4 border-error";
	}
});

// Dynamic Icon Based on Feedback Type
const iconName = computed(() => {
	switch (currentFeedback.value?.type) {
		case "success":
			return "uil:check-circle";
		case "alert":
			return "uil:exclamation-circle";
		case "error":
		default:
			return "uil:times-circle";
	}
});

const iconClass = computed(() => {
	switch (currentFeedback.value?.type) {
		case "success":
			return "text-success";
		case "alert":
			return "text-alert";
		case "error":
		default:
			return "text-error";
	}
});

const clearFeedback = () => {
	feedbackStore.clearFeedback();
};
</script>

  <style scoped>
  .fixed {
    z-index: 50;
	transition: transform 0.3s ease, opacity 0.3s ease;
  }
  </style>
