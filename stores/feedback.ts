import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { FeedbackType, IFeedback } from "@/types/feedback";

export const useFeedbackStore = defineStore("feedback", () => {
	const feedback = ref<IFeedback | null>(null);

	const showFeedback = computed(() => !!feedback.value);
	const currentFeedback = computed(() => feedback.value);

	function setFeedback(message: string, type: FeedbackType) {
		feedback.value = { message, type };

		// Clear feedback after 5 seconds
		setTimeout(() => {
			feedback.value = null;
		}, 5000);
	}

	function clearFeedback() {
		feedback.value = null;
	}

	return {
		showFeedback,
		currentFeedback,
		setFeedback,
		clearFeedback,
	};
});
