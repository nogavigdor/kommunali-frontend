// https://nuxt.com/docs/api/configuration/nuxt-config
// import { cjsInterop } from "vite-plugin-cjs-interop";

export default defineNuxtConfig({
	modules: ["@nuxt/eslint", "@nuxt/ui", "nuxt-mapbox", // "@nuxtjs/algolia",
		"nuxt-vuefire", "@nuxt/icon", "@nuxt/image", "@vueuse/nuxt"],
	devtools: {
		enabled: true,

		timeline: {
			enabled: true,
		},
	},
	app: {
		head: {
			link: [
				{ rel: "preconnect", href: "https://fonts.googleapis.com" },
				{ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
				{ href: "https://fonts.googleapis.com/css2?family=Atma:wght@300;400;500;600;700&family=Karla:ital,wght@0,200..800;1,200..800&display=swap", rel: "stylesheet" },

			],
		},
		pageTransition: {
			name: "page",
			mode: "out-in",
		},
	},
	colorMode: {
		preference: "light",
	},
	ui: {
		safelistColors: ["brandPrimary", "brandGray"],
	},
	// css: [
	//	"~/assets/css/tailwind.css",
	// ],
	runtimeConfig: {

		public: {
			apiBaseUrl: process.env.API_BASE_URL,
			googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
			mapboxApiKey: process.env.MAPBOX_ACCESS_TOKEN,
			/*
																								algolia: {
																																apiKey: process.env.ALGOLIA_API_KEY,
																																applicationId: process.env.ALGOLIA_APPLICATION_ID,
																								},
																								*/
			typesense: {
				apiKey: process.env.TYPESENSE_API_KEY,
				nodes: JSON.parse(process.env.TYPESENSE_NODES || "[]"),
				collectionName: process.env.TYPESENSE_COLLECTION_NAME || "dev_kommunali_products",
			},

		},

	},
	// vite: {
	// 	plugins: [
	// 		cjsInterop({
	// 			dependencies: ["typesense-instantsearch-adapter"],
	// 		}),
	// 	],
	// },
	// build: {
	// 	transpile: ["typesense-instantsearch-adapter"],
	// },
	compatibilityDate: "2024-04-03",

	// algolia: {
	//	apiKey: process.env.ALGOLIA_API_KEY,
	//	applicationId: process.env.ALGOLIA_APPLICATION_ID,
	//	instantSearch: {
	//		theme: "algolia",
	//	},
	// },

	eslint: {
		config: {
			stylistic: {
				indent: "tab",
				semi: true,
				quotes: "double",
			},
		},
	},
	mapbox: {
		accessToken: "pk.eyJ1Ijoibm9nYXZpZyIsImEiOiJjbTB4bTBleHUwYnhuMmtzZmFsZ3ZsYW9rIn0.uj1O94f_PYARWEcJZ2y46Q",
	},
	vuefire: {
		config: {
			apiKey: process.env.FIREBASE_API_KEY,
			authDomain: process.env.FIREBASE_AUTH_DOMAIN,
			projectId: process.env.FIREBASE_PROJECT_ID,
			appId: process.env.FIREBASE_APP_ID,
			storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
		},
		auth: {
			enabled: true,
			sessionCookie: true,
		},
	},
});
