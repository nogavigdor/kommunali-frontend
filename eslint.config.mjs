// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
	// Your custom configs here
	rules: {
		"vue/html-closing-bracket-newline": [
			"error",
			{
				singleline: "never",
				multiline: "never",
			},
		],
	},
});
