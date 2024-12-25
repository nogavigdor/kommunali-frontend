<template>
	<ais-instant-search
		class="absolute z-20 top-4 right-4"
		:search-client="searchClient"
		:index-name="indexName">
		<!-- Search Bar -->
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
				<ais-autocomplete>
					<template #default="{ currentRefinement, indices, refine }">
						<input
							type="search"
							:value="currentRefinement"
							placeholder="Search for a product"
							class="w-full px-4 py-2 bg-white text-gray-800 rounded-lg border border-brandGray-300 focus:outline-none focus:ring-2 focus:ring-brandPrimary-500 transition-all"
							@input="refine($event.currentTarget.value)">
						<div
							v-if="currentRefinement.length > 0 && indices[0].hits.length > 0"

							class="absolute z-16 w-full">
							<ul class="absolute z-20 list-none p-0 m-0">
								<li
									v-for="hit in indices[0].hits"
									:key="hit.objectID"
									class=" py-2 px-3 bg-white text-black rounded-lg shadow-soft hover:bg-neutral-dark hover:text-white cursor-pointer transition-all"
									@click="highlightShops([hit])">
									{{ hit.name }} - {{ hit.description }} - {{ hit.price }} Kr
								</li>
							</ul>
							<button
								type="button"
								class="btn-primary"
								@click="highlightShops(indices[0].hits)">
								Show all shops
							</button>
						</div>
					</template>
				</ais-autocomplete>
			</div>
		</div>

		<!-- Search Results -->
	</ais-instant-search>
</template>

<script setup>
import { ref } from "vue";
import { AisInstantSearch, AisAutocomplete } from "vue-instantsearch/vue3/es";
import { liteClient as algoliasearch } from "algoliasearch/lite";
// import "instantsearch.css/themes/algolia-min.css";
import { useShopsStore } from "@/stores/shops";
import { _0 } from "#tailwind-config/theme/backdropBlur";

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

function toggleSearch() {
	isSearchOpen.value = !isSearchOpen.value;
}

function highlightShops(items) {
	const highlightedShopIds = [...new Set(items.map(item => item.storeId))]; // Extract unique shop IDs
	// emit("highlight-shops", shopIds); // Emit shop IDs to the parent component
	shopStore.setHighlightedShops(highlightedShopIds);
	console.log("Send from the seach bar: The highlighted shops are: ", highlightedShopIds);
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
