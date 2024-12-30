<template>
	<div class="flex flex-col items-center space-y-6">
		<div class="w-full flex flex-col items-center space-y-4">
			<label for="file-input">Upload or Take a Picture:</label>
			<input
				id="file-input"
				class="text-lg font-heading text-brandPrimary-500"
				type="file"
				capture="environment"
				accept="image/*"
				multiple="false"
				@change="handleImageUpload">
			<UTooltip class="text-brandGray-500">
				<template #trigger>
					<button
						class="btn-primary"
						aria-label="Help for file input">
						<Icon name="info-circle" />
					</button>
				</template>
				Upload an image from your device or take a picture using your camera.
			</UTooltip>
		</div>
		<div
			v-if="imageUrl"
			class="w-full max-w-md">
			<p class="text-md font-sans text-neutral-dark">
				Preview:
			</p>
			<img
				:src="imageUrl"
				alt="Uploaded Image"
				class="w-full rounded-lg shadow-soft border border-brandGray-300">
		</div>
		<div
			v-if="errorMessage"
			class="w-full max-w-md bg-error-light text-error-dark p-4 rounded-lg shadow-soft">
			<p class="text-error-dark">
				{{ errorMessage }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getAuth } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

// Pinia store
// const userStore = useUserStore();
// const { user } = storeToRefs(userStore);

// Reactive variables
const imageUrl = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const emit = defineEmits(["image-uploaded", "uploading"]);

// Firebase storage reference
const storage = getStorage();

// Handle image upload (triggered when file input changes)
function handleImageUpload(event: Event) {
	errorMessage.value = null; // Reset any previous errors
	const file = (event.target as HTMLInputElement).files?.[0];
	if (file) {
		if (validateImage(file)) {
			previewImage(file);
			uploadImageToStorage(file);
		}
		else {
			errorMessage.value = "Invalid image file. Please upload a valid image (max size: 5MB, formats: JPEG, PNG, WEBP).";
		}
	}
	else {
		errorMessage.value = "No file selected.";
	}
}

/// / Validate image file
function validateImage(file: File): boolean {
	const validTypes = ["image/jpeg", "image/png", "image/webp"];
	const maxSizeInMB = 5;
	const fileSizeInMB = file.size / (1024 * 1024);
	return validTypes.includes(file.type) && fileSizeInMB <= maxSizeInMB;
}

// Preview image
function previewImage(file: File): void {
	const reader = new FileReader();
	reader.onload = () => {
		imageUrl.value = reader.result as string;
	};
	reader.readAsDataURL(file);
}

// Upload image to localstorage (Firebase)
async function uploadImageToStorage(file: File): Promise<string> {
	const auth = getAuth(); // Ensure auth is initialized
	const user = auth.currentUser;
	if (!user) {
		throw new Error("User is not authenticated. Cannot upload image.");
	}
	try {
		emit("uploading", true); // Start upload state
		const userId = user.uid;
		const storagePath = `users/${userId}/products/${Date.now()}_${file.name}`; // Unique file path per user
		const storageReference = storageRef(storage, storagePath);

		// Defines the custom metadata to include the owner UID
		// in order to comply with the rules which I've set in Firebase Storage
		// and later on will enable to edit the file only by the owner (aka the product owner)
		const metadata = {
			customMetadata: {
				OwnerFirebaseUserId: userId, // Attach the owner UID as metadata
			},
		};
		// Upload file
		const snapshot = await uploadBytes(storageReference, file, metadata);

		// Get download URL
		const downloadURL = await getDownloadURL(snapshot.ref);

		// Update image URL (to be sent to MongoDB later)
		imageUrl.value = downloadURL;

		console.log("Image uploaded successfully:", downloadURL);
		// Emit the image URL to the parent
		emit("image-uploaded", downloadURL);
	}
	catch (error) {
		console.error("Error uploading image:", error);
		errorMessage.value = "Failed to upload image. Please try again.";
	}
	finally {
		emit("uploading", false); // End upload state
	}
}

// Save image URL to MongoDB
async function saveImageToMongoDB(imageUrl: string): Promise<void> {
	try {
		await $fetch("/api/saveImage", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId: user.value.firebaseUserId,
				imageUrl,
			}),
		});
		console.log("Image URL saved to MongoDB");
	}
	catch (error) {
		console.error("Error saving image to MongoDB:", error);
		errorMessage.value = "Failed to save image URL. Please try again.";
	}
}
</script>
