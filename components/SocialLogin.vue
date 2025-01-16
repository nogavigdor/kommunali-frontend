<template>
	<div class="flex flex-col space-y-3 pt-4">
		<UButton
			class="w-full flex justify-center bg-red-500 text-white"
			@click="handleGoogleLogin">
			<UIcon
				name="i-heroicons-google"
				class="mr-2" /> Sign in with Google
		</UButton>
		<UButton
			class="w-full flex justify-center bg-blue-600 text-white"
			@click="handleFacebookLogin">
			<UIcon
				name="i-heroicons-facebook"
				class="mr-2" /> Sign in with Facebook
		</UButton>

		<!-- Nickname Modal for New Users -->
		<NicknameModal
			v-model="showNicknameModal"
			:user-data="newUserData"
			@update:show="handleUpdateShow" />
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useFeedbackStore } from "@/stores/feedback";

const userStore = useUserStore();
const feedbackStore = useFeedbackStore();
const router = useRouter();

const showNicknameModal = ref(false);
const newUserData = ref<{ isNewUser: boolean; email: string; firebaseUserId: string } | null>(null);

async function handleGoogleLogin() {
	try {
		const result = await userStore.loginWithGoogle();
		if (result?.isNewUser) {
			console.log("result", result);
			newUserData.value = result;
			showNicknameModal.value = true;
		}
		else {
			router.push("/");
		}
	}
	catch (error) {
		console.error("Google login error:", error);
		feedbackStore.setFeedback("Google login failed.", "error");
	}
}

async function handleFacebookLogin() {
	try {
		const result = await userStore.loginWithFacebook();
		if (result?.isNewUser) {
			newUserData.value = result;
			showNicknameModal.value = true;
		}
		else {
			router.push("/");
		}
	}
	catch (error) {
		console.error("Google login error:", error);
		feedbackStore.setFeedback("Facebook login failed.", "error");
	}
}

const handleUpdateShow = (value: boolean) => {
	showNicknameModal.value = value;
	router.push("/");
};
</script>
