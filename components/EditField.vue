<template>
	<div class="flex items-center">
		<div v-if="!editing">
			<span>{{ value }}</span>
			<button
				class="ml-2"
				@click="edit">
				<Icon
					name="uil:pen"
					style="color: black" />
			</button>
		</div>
		<div v-else>
			<input
				v-model="editableValue"
				class="border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm">
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
import { ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps<{
	value?: string;
	field: string;
}>();

const emits = defineEmits(["updateField"]);

const editing = ref(false);
const editableValue = ref(props.value);

watch(() => props.value, (newValue) => {
	editableValue.value = newValue;
});

function edit() {
	editing.value = true;
}

function save() {
	editing.value = false;
	emits("updateField", { field: props.field, value: editableValue.value });
}
</script>

  <style scoped>
    button {
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
  </style>
