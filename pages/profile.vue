<template>
	<div class="page-transition">
		<div class="flex justify-between items-center mb-4">
			<h1 class="text-2xl font-bold">
				Profile Page
			</h1>
			<ToLink
				link="/"
				icon="arrow-left"
				tooltip-text="Back to Home Page" />
		</div>
		<p>View and edit profile information.</p>
		<label
			for="nickname"
			class="block mt-4">Your Nickname:</label>
		<EditField
			id="nickname"
			:field-type="'text'"
			:field-name="'nickname'"
			:field-value="user.nickname"
			@update-field="updateUserField" />
	</div>
</template>

<script setup  lang="ts">
import { useUserStore } from "@/stores/user";
import type { IUser } from "@/types/user";

const userStore = useUserStore();

const user = computed(() => userStore.user);

async function updateUserField({ fieldName, fieldValue }: { fieldName: keyof IUser; fieldValue: string }) {
	if (user.value) {
		const updatedData = { [fieldName]: fieldValue, _id: user.value._id } as Partial<IUser> & { _id: string };

		try {
			console.log("Updating user...", updatedData);
			await userStore.updateUser(updatedData);
			console.log("User updated successfully");
		}
		catch (error) {
			console.error("Error updating user:", error);
		}
	}
}

definePageMeta({
	middleware: "auth",
	title: "Profile",
	requiresUserAuth: true,
	meta: [
		{
			name: "description",
			content: "View and edit profile information.",
		},
	],
});
</script>
