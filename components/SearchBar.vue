<template>
	<ais-instant-search
		:search-client="searchClient"
		:index-name="indexName">
		<div class="relative flex items-center gap-3 p-3 bg-neutral-light rounded-lg shadow-soft">
			<button
				class="btn-primary flex items-center justify-center"
				aria-label="Toggle search bar"
				@click="toggleSearch">
				<Icon
					name="uil:search"
					class="text-xl" />
			</button>
			<input
				v-show="isSearchOpen"
				v-model="searchQuery"
				type="text"
				placeholder="Search products..."
				class="search-input hidden lg:block w-full max-w-xs px-4 py-2 bg-white rounded-lg border border-brandGray-300 focus:outline-none focus:ring-2 focus:ring-brandPrimary-500 transition-all"
				@input="onSearch">
		</div>

		<!-- Search Results -->
		<ais-hits>
			<template #default="{ items }">
				<ul class="mt-4 list-disc pl-6">
					<li
						v-for="item in items"
						:key="item.objectID"
						class="py-2 px-3 bg-white rounded-lg shadow-soft hover:bg-neutral-dark hover:text-white cursor-pointer transition-all"
						@click="highlightShop(item.shopId)">
						{{ item.name }} - {{ item.description }} - {{ item.price }} Kr
					</li>
				</ul>
				<button
					v-if="items.length"
					class="btn-primary mt-3"
					@click="emitSearchResults(items)">
					Highlight Shops
				</button>
			</template>
		</ais-hits>
	</ais-instant-search>
</template>

<script setup>
import { ref } from "vue";
import { AisInstantSearch, AisHits } from "vue-instantsearch/vue3/es";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import "instantsearch.css/themes/algolia-min.css";

// import { createSearchClient } from "vue-instantsearch";

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

function emitSearchResults(items) {
	const shopIds = [...new Set(items.map(item => item.shopId))]; // Extract unique shop IDs
	emit("highlight-shops", shopIds); // Emit shop IDs to the parent component
}
</script>
