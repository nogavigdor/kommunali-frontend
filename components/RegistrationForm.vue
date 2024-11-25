<template>
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-brandPrimary-500 to-brandPrimary-800 text-white py-12 px-6 lg:px-8">
		<div class="max-w-md w-full bg-white text-gray-900 rounded-lg shadow-lg p-8 space-y-6">
			<h2 class="text-center text-3xl font-extrabold">
				Create Your Account
			</h2>
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
import type { FormSubmitEvent } from "#ui/types";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const state = reactive({
	email: "",
	password: "",
});

const passwordVisible = ref(false);

const passwordFieldType = computed(() => (passwordVisible.value ? "text" : "password"));

function togglePasswordVisibility() {
	passwordVisible.value = !passwordVisible.value;
}

async function onSubmit(event: FormSubmitEvent<typeof state>) {
	try {
		const newUser = {
			email: event.data.email,
			password: event.data.password,
		};
		userStore.registerUser(newUser);
	}
	catch (error) {
		console.error("Error during registration:", error);
	}
}
</script>

  <style scoped>

  </style>
