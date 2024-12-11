import { useUserStore } from "@/stores/user";

export default defineNuxtRouteMiddleware((to, from) => {
	const userStore = useUserStore();
	// If the user is not logged in and the route requires user authentication,
	// redirect to the login page
	if (!userStore.loggedIn && to.meta.requiresUserAuth) {
		return navigateTo("/login");
	}
	// If the user is not an admin and the route requires admin authentication,
	// redirect to the home page
	if (!userStore.isAdmin && to.meta.requiresAdminAuth) {
		return navigateTo("/");
	}
	// If the route is the loggin page, but the user is logged in,
	// redirect to the home page
	if (to.path === "/login" && userStore.loggedIn) {
		return navigateTo("/");
	}
});
