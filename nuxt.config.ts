// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@nuxt/eslint", "@nuxt/ui", "nuxt-mapbox"],
	devtools: { enabled: true },
	app: {
		head: {
			link: [
				{ rel: "preconnect", href: "https://fonts.googleapis.com" },
				{ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
				{ href: "https://fonts.googleapis.com/css2?family=Atma:wght@300;400;500;600;700&display=swap", rel: "stylesheet" },
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
		public: {
			apiBaseUrl: process.env.API_BASE_URL,
			googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
			mapboxApiKey: process.env.MAPBOX_ACCESS_TOKEN,
		},
	},
	compatibilityDate: "2024-04-03",
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
});
