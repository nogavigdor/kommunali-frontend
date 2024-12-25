<template>
	<div class="relative flex items-center gap-3 p-3 bg-neutral-light rounded-lg shadow-soft">
		<button
			class="relative btn-primary flex items-center justify-center"
			aria-label="Toggle search bar"
			@click="toggleSearch">
			<Icon
				name="uil:search"
				class="text-xl" />
		</button>

		<div class="relative flex-grow">
			<input
				v-model="searchQuery"
				type="search"
				placeholder="Search for a product"
				class="w-full px-4 py-2 bg-white text-gray-800 rounded-lg border border-brandGray-300 focus:outline-none focus:ring-2 focus:ring-brandPrimary-500 transition-all"
				@input="searchProducts">
			<div
				v-if="searchResults.length > 0"
				class="absolute z-16 w-full">
				<ul class="absolute z-20 list-none p-0 m-0">
					<li
						v-for="hit in searchResults"
						:key="hit.id"
						class="py-2 px-3 bg-white text-black rounded-lg shadow-soft hover:bg-neutral-dark hover:text-white cursor-pointer transition-all"
						@click="highlightShops([hit])">
						<img
							:src="hit.imageUrl"
							alt="Product image"
							class="w-8 h-8 rounded-full">
						{{ hit.name }} - {{ hit.description }} {{ hit.price }} Kr
					</li>
					<button
						type="button"
						class="btn-primary "
						@click="highlightShops(searchResults)">
						Show all shops
					</button>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import Typesense from "typesense";
import { useShopsStore } from "@/stores/shops";

const config = useRuntimeConfig();
const shopStore = useShopsStore();

// Configure the Typesense client
const typesenseClient = new Typesense.Client({
	nodes: config.public.typesense.nodes,
	apiKey: config.public.typesense.apiKey,
	connectionTimeoutSeconds: 2,
});

const collectionName = config.public.typesense.collectionName;

const searchQuery = ref("");
const searchResults = ref([]);
const isSearchOpen = ref(false);

function toggleSearch() {
	isSearchOpen.value = !isSearchOpen.value;
}

async function searchProducts() {
	if (!searchQuery.value) {
		searchResults.value = [];
		return;
	}

	try {
		const response = await typesenseClient.collections(collectionName).documents().search({
			q: searchQuery.value,
			query_by: "name,description",
			sort_by: "createdAt:desc",
		});
		searchResults.value = response.hits.map(hit => hit.document);
	}
	catch (error) {
		console.error("Error searching products in Typesense:", error);
		searchResults.value = [];
	}
}

function highlightShops(items) {
	const highlightedShopIds = [...new Set(items.map(item => item.storeId))];
	shopStore.setHighlightedShops(highlightedShopIds);
	console.log("Highlighted shops:", highlightedShopIds);
}
</script>

  <style scoped>
  .search-input {
	position: relative;
	padding-right: 2rem; /* Add space for the clear button */
  }

  .search-results {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: white;
	z-index: 10;
	box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
	border-radius: 0.5rem;
	max-height: 300px;
	overflow-y: auto;
	margin-top: 0.5rem;
  }

  @media (max-width: 768px) {
.search-results {
max-height: 200px;
	}
  }
  </style>
