<template>
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-brandPrimary-800 to-brandPrimary-500 text-white py-12 px-6 lg:px-8">
		<div class="max-w-md w-full bg-white text-gray-900 rounded-lg shadow-lg p-8 space-y-6">
			<h2 class="text-center text-3xl font-extrabold">
				Please Login
			</h2>
			<p class="text-center text-sm text-gray-600">
				Login to your account or
				<a
					class="font-medium text-brandPrimary-500 hover:text-brandPrimary-700 cursor-pointer"
					@click="navigateToRegister">
					sign up here
				</a>
			</p>
			<UForm
				:state="state"
				class="space-y-4"
				@submit="onSubmit">
				<!-- Email -->
				<UFormGroup
					label="Email"
					name="email">
					<UInput
						v-model="state.email"
						placeholder="Email Address"
						type="email"
						:class="{ 'border-error-500': validationErrors.email }" />
					<p
						v-if="validationErrors.email"
						class="text-error-500 text-sm">
						{{ validationErrors.email }}
					</p>
				</UFormGroup>

				<!-- Password -->
				<UFormGroup
					label="Password"
					name="password">
					<div class="relative">
						<UInput
							v-model="state.password"
							:placeholder="'Password'"
							:type="passwordVisible ? 'text' : 'password'"
							:class="{ 'border-error-500': validationErrors.password }" />
						<button
							type="button"
							class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
							@click="togglePasswordVisibility">
							<UIcon :name="passwordVisible ? 'i-heroicons-eye-off' : 'i-heroicons-eye'" />
						</button>
					</div>
					<p
						v-if="validationErrors.password"
						class="text-error-500 text-sm">
						{{ validationErrors.password }}
					</p>
				</UFormGroup>

				<!-- Login Button -->
				<div class="pt-4">
					<UButton
						type="submit"
						class="btn-primary w-full">
						Login
					</UButton>
				</div>
			</UForm>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import type { FormSubmitEvent } from "#ui/types";
import { useUserStore } from "@/stores/user";
import { useFeedbackStore } from "@/stores/feedback";
import FeedbackMessage from "@/components/FeedbackMessage.vue";

const feedbackStore = useFeedbackStore();

const userStore = useUserStore();
const router = useRouter();

const state = reactive({
	email: "",
	password: "",
});

const passwordVisible = ref(false);
const validationErrors = reactive<{ email?: string; password?: string }>({});
const feedbackMessage = ref<string | null>(null);
const feedbackType = ref<"success" | "error" | "alert">("error");

function togglePasswordVisibility() {
	passwordVisible.value = !passwordVisible.value;
}

function navigateToRegister() {
	router.push("/register");
}

// Live validation using watchers
watch(
	() => state.email,
	(newEmail) => {
		if (!newEmail) {
			validationErrors.email = "Email is required";
		}
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
			validationErrors.email = "Invalid email format";
		}
		else {
			validationErrors.email = undefined;
		}
	},
);

watch(
	() => state.password,
	(newPassword) => {
		if (!newPassword) {
			validationErrors.password = "Password is required";
		}
		else if (newPassword.length < 8) {
			validationErrors.password = "Password must be at least 8 characters";
		}
		else {
			validationErrors.password = undefined;
		}
	},
);

async function onSubmit(event: FormSubmitEvent<typeof state>) {
	try {
		const credentials = {
			email: event.data.email,
			password: event.data.password,
		};

		// Clear any previous backend feedback messages
		feedbackStore.clearFeedback();

		// Attempt to log in
		await userStore.loginUser(credentials);

		console.log("The current user is:", userStore.user);
		// Trigger success feedback after successful login
		feedbackStore.setFeedback("You are now logged in.", "success");
		router.push("/"); // Redirect to the homepage or desired location after login
	}
	catch (error) {
		console.error("Error during login:", error);
		if (error.response && error.response.data && error.response.data.errors) {
			error.response.data.errors.forEach((err: any) => {
				if (err.message.includes("email")) {
					validationErrors.email = err.message;
				}
				else if (err.message.includes("password")) {
					validationErrors.password = err.message;
				}
				else {
					feedbackStore.setFeedback(err.message, "error");
				}
			});
		}
		else {
			feedbackStore.setFeedback("Login failed. Please try again.", "error");
		}
	}
}
</script>

<style scoped>

</style>
