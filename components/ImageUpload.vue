<template>
	<div>
		<input
			type="file"
			@change="onFileChange">
		<img :src="imageUrl">
	</div>
</template>

<script setup lang="ts">
// Handle image upload (triggered when file input changes)
function handleImageUpload(event: Event) {
	const file = (event.target as HTMLInputElement).files?.[0];
	if (file) {
		// Assuming a function 'uploadImageToStorage' exists to handle uploads to Firebase Storage
		uploadImageToStorage(file).then((url) => {
			editableValue.value = url;
		}).catch((error) => {
			console.error("Failed to upload image:", error);
		});
	}
}

// Handle taking a picture using mobile camera
function takePicture() {
	const inputElement = document.createElement("input");
	inputElement.type = "file";
	inputElement.accept = "image/*";
	inputElement.capture = "environment"; // Use the back camera if available

	inputElement.onchange = (event) => {
		handleImageUpload(event);
	};

	inputElement.click();
}

// Assume this function handles the image upload to Firebase Storage and returns a URL
async function uploadImageToStorage(file: File): Promise<string> {
	// Placeholder logic for Firebase upload, replace with your Firebase upload implementation
	const storage = getStorage();
	const storageReference = storageRef(storage, `products/${file.name}`);
	const snapshot = await uploadBytes(storageReference, file);
	const downloadURL = await getDownloadURL(snapshot.ref);
	return downloadURL;
}
</script>
