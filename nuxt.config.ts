// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@nuxt/eslint", "@nuxt/ui", "nuxt-mapbox"],
	devtools: { enabled: true },
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
