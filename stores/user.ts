import { ref } from "vue";
import { defineStore } from "pinia";
import type { MapboxAddressAutofill } from "@mapbox/search-js-web";
import type { IUser, RequestedProduct, IRegisterUser } from "@/types/user";
import { UserRole } from "@/types/user";

export const useUserStore = defineStore("user", () => {
	const config = useRuntimeConfig();
	const userLocation = ref<[number, number]>([0, 0]);
	const user = ref<IUser>({
		firebaseUserId: "",
		role: UserRole.USER,
		email: "",
		firstName: "",
		lastName: "",
		stores: [],
		requested_products: [],
		updatedAt: new Date(),
	});
	const authToken = ref<string | null>(null);
	const loggedIn = ref<boolean>(false);

	function registerUser(newUser: IRegisterUser) {
		$fetch<IUser>(`${config.public.apiBaseUrl}/api/users/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newUser),
		})
			.then((response) => {
				updateUser(response);
			},
			)
			.catch((error) => {
				console.error("Error registering user:", error);
			},
			);
	}

	async function loginUser(credentials: { email: string; password: string }) {
		try {
			const response = await $fetch<{
				user: IUser;
				token: string;
			}>(`${config.public.apiBaseUrl}/api/users/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(credentials),
			});

			// Store the auth token and update the user state
			authToken.value = response.token;
			loggedIn.value = true;
			updateUser(response.user);
		}
		catch (error) {
			console.error("Error logging in user:", error);
			throw error;
		}
	}

	function logOutUser() {
		user.value = {
			firebaseUserId: "",
			role: UserRole.USER,
			email: "",
			firstName: "",
			lastName: "",
			stores: [],
			requested_products: [],
			updatedAt: new Date(),
		};
		loggedIn.value = false;
		// Optionally, clear auth token from storage as well
		localStorage.removeItem("authToken");
	}

	// Mutation to update the user object
	function updateUser(newUser: IUser) {
		user.value = newUser;
	}

	// Mutation to add a requested product to the user
	function addRequestedProduct(product: RequestedProduct) {
		user.value.requested_products.push(product);
	}

	return {
		user,
		userLocation,
		authToken,
		loggedIn,
		logOutUser,
		registerUser,
		loginUser,
		updateUser,
		addRequestedProduct,
	};
});
