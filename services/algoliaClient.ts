import algoliasearch from "algoliasearch/lite";

const algoliaClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_SEARCH_API_KEY!);

export const productsIndex = algoliaClient.initIndex("products");
