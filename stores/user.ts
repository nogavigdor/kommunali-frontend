import { ref } from "vue";
import { defineStore } from "pinia";
import type { MapboxAddressAutofill } from "@mapbox/search-js-web";
import { useFirebaseAuth } from "vuefire";
import { signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";
import { useLocalStorage } from "@vueuse/core";
import { useShopsStore } from "./shops";
import type { IUser, RequestedProduct, IRegisterUser } from "@/types/user";
import { UserRole } from "@/types/user";

export const useUserStore = defineStore("user", () => {
	const firebaseUserId = ref<string>("");
	const auth = useFirebaseAuth()!;
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
		lastCoordinates: [0, 0],
		updatedAt: new Date(),
	});
	// const authToken = ref<string | null>(null);
	const loggedIn = useLocalStorage<boolean>("loggedIn", false);
	const isAdmin = ref<boolean>(false);
	const hasShop = ref<boolean>(false);

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

	// Sign in user with email and password utilizing Firebase Auth
	async function loginUser(credentials: { email: string; password: string }) {
		try {
			console.log("auth: ", auth);
			// Set persistence to local to keep the user logged in between sessions
			await setPersistence(auth, browserLocalPersistence);
			const response = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
			console.log("auth: ", auth);
			console.log("User logged in:", response);
			loggedIn.value = true;
			// userLocation.value = [response.user.lastCoordinates[0], response.user.lastCoordinates[1]];
			// updateUser(response.user);
			firebaseUserId.value = response.user.uid;
			// get the user from mongodb according to the firebaseUserId
			const userResponse: IUser = await getUser(firebaseUserId.value);
			// its important to notice that shop is the same as store
			// if the user has a shop, then hasShop is set to true
			if (userResponse.stores.length > 0) {
				hasShop.value = true;
			}
			if (userResponse.role === UserRole.ADMIN) {
				isAdmin.value = true;
			}
			user.value = userResponse;
			userLocation.value = userResponse.lastCoordinates;
			// get the user shop - in order to updae the userShop in the shops store
			const shopsStore = useShopsStore();
			if (userResponse.stores[0]?._id) {
				shopsStore.getUserShop(userResponse.stores[0]._id);
			}
		}
		catch (error) {
			console.error("Error logging in user:", error);
			throw error;
		}
	}

	// Gets the user from mongodb database according to the firebaseUserId
	async function getUser(firebaseUserId: string) {
		if (!auth.currentUser) {
			throw new Error("No authenticated user found");
		}

		const token = await auth.currentUser.getIdToken(); // Fetch the fresh token
		console.log("Token being sent:", token);
		const response = await $fetch<IUser>(`${config.public.apiBaseUrl}/api/users/${firebaseUserId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`, // Send the valid token
			},
		});

		return response;
	}

	async function logOutUser() {
		await signOut(auth); // Log out from Firebase
		user.value = {
			firebaseUserId: "",
			role: UserRole.USER,
			email: "",
			firstName: "",
			lastName: "",
			stores: [],
			lastCoordinates: [0, 0],
			requested_products: [],
			updatedAt: new Date(),
		};

		loggedIn.value = false;
		window.location.reload();
	}

	async function updateUser(updatedUser: Partial<IUser>) {
		if (!auth.currentUser) {
			throw new Error("No authenticated user found");
		}
		const token = await auth.currentUser.getIdToken(); // Fetch the fresh token
		await $fetch<IUser>(`${config.public.apiBaseUrl}/api/users/${firebaseUserId.value}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`, // Send the valid token

			},
			body: JSON.stringify(updatedUser),
		})
			.then((response) => {
				user.value = response;
			})
			.catch((error) => {
				console.error("Error updating user:", error);
			});
	}

	// Mutation to add a requested product to the user
	function addRequestedProduct(product: RequestedProduct) {
		user.value.requested_products.push(product);
	}

	function getRole() {
		return user.value.role;
	}

	return {
		user,
		hasShop,
		userLocation,
		auth,
		loggedIn,
		logOutUser,
		registerUser,
		loginUser,
		updateUser,
		addRequestedProduct,
		firebaseUserId,
		getUser,
		getRole,
		isAdmin,
	};
});
