<template>
	<UModal
		v-model="show"
		class="flex items-center justify-center"
		@close="emit('update:show', false)">
		<div class="max-w-md w-full bg-secondary-light text-gray-900 rounded-lg shadow-lg p-6 space-y-6">
			<h2 class="text-center text-2xl font-bold text-brandPrimary-500">
				Choose a Nickname
			</h2>
			<p class="text-center text-gray-700">
				Please enter a nickname to complete your registration.
			</p>

			<UForm
				:state="{ nickname }"
				@submit="submitNickname">
				<UFormGroup
					label="Nickname"
					name="nickname">
					<UInput
						v-model="nickname"
						placeholder="Enter your nickname"
						class="w-full" />
					<p
						v-if="error"
						class="text-error-500 text-sm mt-2">
						{{ error }}
					</p>
				</UFormGroup>

				<div class="flex justify-center pt-4">
					<UButton
						type="submit"
						class="w-full text-xl btn-primary">
						Save
					</UButton>
				</div>
			</UForm>
		</div>
	</UModal>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import { useUserStore } from "@/stores/user";
import { useFeedbackStore } from "@/stores/feedback";

const userStore = useUserStore();
const feedbackStore = useFeedbackStore();

const show = defineModel<boolean>();

const props = defineProps<{ userData: { isNewUser: boolean; email: string; firebaseUserId: string } | null }>();
const emit = defineEmits(["update:show"]);
const nickname = ref("");
const error = ref("");

async function submitNickname() {
	if (!nickname.value || nickname.value.length < 3) {
		error.value = "Nickname must be at least 3 characters.";
		return;
	}

	try {
		await userStore.registerSocialUser(nickname.value, props.userData!.email, props.userData!.firebaseUserId);
		feedbackStore.setFeedback("Nickname saved successfully!", "success");
		emit("update:show", false); // Close modal after successful submission
	}
	catch (err) {
		error.value = "Error saving nickname.";
		feedbackStore.setFeedback("Error saving nickname.", "error");
		console.error(err);
	}
}
</script>
