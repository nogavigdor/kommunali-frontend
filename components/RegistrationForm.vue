<template>
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-brandPrimary-500 to-brandPrimary-800 text-white py-12 px-6 lg:px-8">
		<div class="max-w-md w-full bg-white text-gray-900 rounded-lg shadow-lg p-8 space-y-6">
			<h2 class="text-center text-3xl font-extrabold">
				Create Your Account
			</h2>
			<p class="text-center text-sm text-gray-600">
				Do you already have an account?
				<a
					class="font-medium text-brandPrimary-500 hover:text-brandPrimary-700 cursor-pointer"
					@click="navigateToLogin">
					Login here
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
						type="email" />
					<p
						v-if="validationErrors.email"
						class="text-alert-500 text-sm">
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
							placeholder="Password"
							:type="passwordFieldType" />
						<button
							type="button"
							class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
							@click="togglePasswordVisibility">
							<UIcon :name="passwordVisible ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" />
						</button>
					</div>
					<p
						v-if="validationErrors.password"
						class="text-alert-500 text-sm">
						{{ validationErrors.password }}
					</p>
				</UFormGroup>

				<div class="pt-4">
					<UButton
						type="submit"
						class="btn-primary w-full">
						Register
					</UButton>
				</div>
			</UForm>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import type { FormSubmitEvent } from "#ui/types";
import { useUserStore } from "@/stores/user";
import { useFeedbackStore } from "@/stores/feedback";
import type { FeedbackType } from "@/types/feedback";

const userStore = useUserStore();
const feedbackStore = useFeedbackStore();
const router = useRouter();

const state = reactive({
	email: "",
	password: "",
});

const passwordVisible = ref(false);
const validationErrors = reactive<{ email?: string; password?: string }>({});
const backendError = ref<string | null>(null);
const feedbackType = ref<FeedbackType | null>(null);

const navigateToLogin = () => {
	router.push("/login");
};

const passwordFieldType = computed(() => (passwordVisible.value ? "text" : "password"));

function togglePasswordVisibility() {
	passwordVisible.value = !passwordVisible.value;
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
		const newUser = {
			email: event.data.email,
			password: event.data.password,
		};

		// Clear any previous backend error messages
		backendError.value = null;

		await userStore.registerUser(newUser);

		// Trigger success feedback after successfull registration  and redirect to login page
		feedbackStore.setFeedback("You have been successfully registered.", "success");
		router.push("/login");
	}
	catch (error) {
		console.error("Error during registration:", error);
		feedbackType.value = "error";
		if (error.response && error.response.data && error.response.data.errors) {
			error.response.data.errors.forEach((err: any) => {
				if (err.message.includes("email")) {
					validationErrors.email = err.message;
				}
				else if (err.message.includes("password")) {
					validationErrors.password = err.message;
				}
				else {
					backendError.value = err.message;
				}
			});
		}
		else {
			feedbackStore.Feedback("Registration failed due to technical issues. Please try again.", "error");
		}
	}
}
</script>

  <style scoped>

  </style>
