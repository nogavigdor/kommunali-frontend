<template>
	<ais-instant-search
		:search-client="searchClient"
		:index-name="indexName">
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
					v-show="isSearchOpen"
					v-model="searchQuery"
					type="text"
					placeholder="Search products..."
					class="absolute right-0 top-5 search-input hidden lg:block w-full max-w-xs px-4 py-2 bg-white text-gray-800 rounded-lg border border-brandGray-300 focus:outline-none focus:ring-2 focus:ring-brandPrimary-500 transition-all"
					@input="onSearch">
				<button
					v-if="searchQuery.length > 0"
					class="absolute top-1/2 right-3 transform -translate-y-1/2 text-brandGray-500 hover:text-brandGray-700"
					@click="clearSearch">
					<Icon
						name="uil:times"
						class="text-lg" />
				</button>
			</div>
		</div>

		<!-- Search Results -->
		<div v-if="searchQuery.length > 0">
			<ais-hits>
				<template #default="{ items }">
					<ul class="list-none p-0 m-0">
						<li
							v-for="item in items"
							:key="item.objectID"
							class="py-2 px-3 bg-white rounded-lg shadow-soft hover:bg-neutral-dark hover:text-white cursor-pointer transition-all"
							@click="highlightShop(item.storeId)">
							{{ item.name }} - {{ item.description }} - {{ item.price }} Kr
						</li>
					</ul>
					<button
						v-if="items.length"
						class="btn-primary mt-3"
						@click="highlightShops(items)">
						Highlight Shops
					</button>
				</template>
			</ais-hits>
		</div>
	</ais-instant-search>
</template>

<script setup>
import { ref } from "vue";
import { AisInstantSearch, AisHits } from "vue-instantsearch/vue3/es";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import "instantsearch.css/themes/algolia-min.css";
import { useShopsStore } from "@/stores/shops";

// import { createSearchClient } from "vue-instantsearch";

// Emit event for parent component
// const emit = defineEmits(["highlight-shops"]);

const shopStore = useShopsStore();

const config = useRuntimeConfig();

const indexName = "dev_kommunali_products";

// const algolia = useAlgoliaRef();

const searchClient = algoliasearch(
	config.public.algolia.applicationId,
	config.public.algolia.apiKey,
);

/*
const searchClient = createSearchClient({
	appId: config.public.algoliaAppId,
	apiKey: config.public.algoliaSearchApiKey,
}); */

const isSearchOpen = ref(false);
const searchQuery = ref("");

function toggleSearch() {
	isSearchOpen.value = !isSearchOpen.value;
}

function highlightShops(items) {
	const shopIds = [...new Set(items.map(item => item.storeId))]; // Extract unique shop IDs
	// emit("highlight-shops", shopIds); // Emit shop IDs to the parent component
	shopStore.setHighlightedShops(shopIds);
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
