<template>
	<div class="flex items-center">
		<div v-if="!editing">
			<span v-if="fieldType !== 'image'">{{ fieldValue }}</span>
			<img
				v-if="fieldType === 'image'"
				:src="fieldValue"
				alt="Image"
				class="w-20 h-20 object-cover rounded-md">

			<button
				v-if="loggedIn"
				class="ml-2"
				@click="edit">
				<Icon
					name="uil:pen"
					style="color: black" />
			</button>
		</div>
		<!-- Editing state -->
		<div v-else>
			<template v-if="fieldType === 'text' || fieldType === 'number'">
				<input
					v-model="editableValue"
					:type="fieldType"
					class="border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm">
			</template>

			<template v-if="fieldType === 'select'">
				<select
					v-model="editableValue"
					class="border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm">
					<option
						v-for="option in options"
						:key="option"
						:value="option">
						{{ option }}
					</option>
				</select>
			</template>

			<template v-if="fieldType === 'image'">
				<input
					type="file"
					accept="image/*"
					class="mb-2"
					@change="handleImageUpload">
				<button
					class="ml-2 btn btn-primary"
					@click="takePicture">
					Take Picture
				</button>
			</template>
			<button
				class="ml-2"
				@click="save">
				<Icon
					name="uil:save"
					style="color: black" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref, watch, defineProps, defineEmits } from "vue";
import { useUserStore } from "~/stores/user";

const props = defineProps<{
	fieldType: "text" | "number" | "select" | "image";
	fieldValue?: string;
	fieldName: string;
	options?: string[];
}>();

const emits = defineEmits(["updateField", "updateImage", "takePicture", "handleImageUpload"]);

const loggedIn = storeToRefs(useUserStore()).loggedIn;

const editing = ref(false);
const editableValue = ref(props.fieldValue);

watch(() => props.fieldValue, (newValue) => {
	editableValue.value = newValue;
});

function edit() {
	editing.value = true;
}

function save() {
	editing.value = false;
	emits("updateField", { fieldName: props.fieldName, fieldValue: editableValue.value });
}

function cancel() {
	editing.value = false;
	editableValue.value = props.fieldValue;
}
</script>

  <style scoped>
    button {
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
  </style>
