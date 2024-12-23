// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@nuxt/eslint", "@nuxt/ui", "nuxt-mapbox", "nuxt-vuefire", // "@nuxtjs/algolia",
		"@nuxt/icon", "@nuxt/image"],
	devtools: { enabled: true },
	app: {
		head: {
			link: [
				{ rel: "preconnect", href: "https://fonts.googleapis.com" },
				{ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
				{ href: "https://fonts.googleapis.com/css2?family=Atma:wght@300;400;500;600;700&family=Karla:ital,wght@0,200..800;1,200..800&display=swap", rel: "stylesheet" },

			],
		},
	},
	ui: {
		safelistColors: ["brandPrimary", "brandGray"],
	},
	// css: [
	//	"~/assets/css/tailwind.css",
	// ],
	runtimeConfig: {
		// for future use of firebase admin sdk of firebse authentification
		firebaseAdmin: {
			type: process.env.FIREBASE_ADMIN_TYPE,
			projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
			privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
			clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
		},
		public: {
			apiBaseUrl: process.env.API_BASE_URL,
			googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
			mapboxApiKey: process.env.MAPBOX_ACCESS_TOKEN,
			algolia: {
				apiKey: process.env.ALGOLIA_API_KEY,
				applicationId: process.env.ALGOLIA_APPLICATION_ID,
			},

		},
	},
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
		},
	},
});
