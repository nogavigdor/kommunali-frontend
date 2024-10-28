import { UAppBar, UIcon, UTooltip,
	USidebar, UList, UListItem } from "@nuxt/ui";
import { defineNuxtPlugin } from "#app";

export default
defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.component("UAppBar", UAppBar);
	nuxtApp.vueApp.component("UIcon", UIcon); nuxtApp.vueApp.component("UTooltip",
		UTooltip); nuxtApp.vueApp.component("USidebar", USidebar);
	nuxtApp.vueApp.component("UList", UList); nuxtApp.vueApp.component("UListItem",
		UListItem);
});
