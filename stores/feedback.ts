import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { FeedbackType, IFeedback } from "@/types/feedback";

export const useFeedbackStore = defineStore("feedback", () => {
	const feedback = ref<IFeedback | null>(null);

	const showFeedback = computed(() => !!feedback.value);
	const currentFeedback = computed(() => feedback.value);

	function setFeedback(message: string, type: FeedbackType) {
		feedback.value = { message, type };
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
