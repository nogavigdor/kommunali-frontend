// app.config.ts for Nuxt UI theme
export default defineAppConfig({
	ui: {
		// Referring to the custom brandPrimary defined in Tailwind config
		primary: "brandPrimary",
		// Referring to the custom brandGray defined in Tailwind config
		gray: "brandGray",
	},
});
