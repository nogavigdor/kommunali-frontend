import { useUserStore } from "@/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
	const userStore = useUserStore();
	const user = await getCurrentUser();

	// If the user is not logged in and the route requires user authentication,
	// redirect to the login page
	if (!user && to.meta.requiresUserAuth) {
		return navigateTo("/login");
	}
	// If the user is not an admin and the route requires admin authentication,
	// redirect to the home page
	if (user && userStore.user.role !== "admin" && to.meta.requiresAdminAuth) {
		return navigateTo("/");
	}
	// If the route is the loggin page, but the user is logged in,
	// redirect to the home page
	if (to.path === "/login" && user) {
		return navigateTo("/");
	}
});
