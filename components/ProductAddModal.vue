<template>
  <!-- Edit Product Modal -->
  <UModal v-model="showAddModal" title="Edit Product">
    <form class="p-8" @submit.prevent="addProduct">
      <Icon
        name="uil:times"
        class="absolute top-2 right-2 cursor-pointer"
        @click="cloaseModal"
      />
      <div class="mb-2">
        <label
          for="edit-product-name"
          class="block text-sm font-medium text-neutral-dark"
          >Product Name</label
        >
        <input
          id="edit-product-name"
          v-model="newProductData.name"
          type="text"
          class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm"
          required
        />
      </div>
      <div class="mb-2">
        <label
          for="edit-product-description"
          class="block text-sm font-medium text-neutral-dark"
          >Description</label
        >
        <textarea
          id="edit-product-description"
          v-model="newProductData.description"
          class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm"
          required
        />
      </div>
      <div class="mb-2">
        <label
          for="edit-product-price"
          class="block text-sm font-medium text-neutral-dark"
          >Price</label
        >
        <input
          id="edit-product-price"
          v-model="newProductData.price"
          type="number"
          min="1"
          step="1"
          class="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm focus:ring-brandPrimary-500 focus:border-brandPrimary-500 sm:text-sm"
          required
        />
      </div>
      <div class="mb-2">
        <label
          for="edit-product-image-url"
          class="block text-sm font-medium text-neutral-dark"
          >Image URL</label
        >
        <ImageUpload
          @image-uploaded="setImageUrl"
          @uploading="handleSaveButton"
        />
        <button
          type="submit"
          :disabled="isImageUploading"
          class="w-full bg-brandPrimary-500 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-brandPrimary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandPrimary-500"
        >
          <span v-if="isImageUploading">
            <Icon name="uil:spinner" class="animate-spin text-xl mr-2" />
            Image is uploading...
          </span>
          <span v-else>
            <Icon name="uil:plus-circle" class="text-xl mr-2" />
            Save Product
          </span>
        </button>
      </div>
    </form>
  </UModal>
</template>

<script setup lang="ts">
import type { IProduct } from "@/types/product";
import { useShopsStore } from "@/stores/shops";

const showAddModal = defineModel<boolean>();

const shopsStore = useShopsStore();

const isImageUploading = ref(false);

const newProductData = ref<IProduct>({
  _id: "",
  name: "",
  description: "",
  price: 0,
  imageUrl: "",
  status: "available",
  requestQueue: [],
  soldTo: undefined,
});

// Set the uploaded image URL
const setImageUrl = (url: string) => {
  newProductData.value.imageUrl = url;
};

const handleSaveButton = (uploading: boolean) => {
  // Disable the save button while image uploading
  // uploading can be true or false - emmited from ImageUpload component
  isImageUploading.value = uploading;
};

const addProduct = async () => {
  try {
    await shopsStore.addProduct(newProductData.value);
    //	const index = userShop.value?.products.findIndex(product => product._id === editProductData.value._id);
    //	if (index !== undefined && index !== -1) {
    //		userShop.value!.products[index] = { ...editProductData.value };
    //	}
    // reset the form
    resetForm();
  } catch (error) {
    console.error("Failed to update product:", error);
  }
};

const cloaseModal = () => {
  resetForm();
};

const resetForm = () => {
  newProductData.value = {
    _id: "",
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    status: "available",
    requestQueue: [],
    soldTo: undefined,
  };
  isImageUploading.value = false;
  showAddModal.value = false;
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
