import { ref } from "vue";
import { defineStore } from "pinia";
import type { MapboxAddressAutofill } from "@mapbox/search-js-web";
import { useFirebaseAuth } from "vuefire";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
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

	// Sign in user with email and password utilizing Firebase Auth
	async function loginUser(credentials: { email: string; password: string }) {
		try {
			console.log("auth: ", auth);
			const response = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
			console.log("auth: ", auth);
			console.log("User logged in:", response);
			loggedIn.value = true;
			// userLocation.value = [response.user.lastCoordinates[0], response.user.lastCoordinates[1]];
			// updateUser(response.user);
			firebaseUserId.value = response.user.uid;
			// get the user from mongodb according to the firebaseUserId
			const userResponse: IUser = await getUser(firebaseUserId.value);
			updateUser(userResponse);
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
		auth,
		loggedIn,
		logOutUser,
		registerUser,
		loginUser,
		updateUser,
		addRequestedProduct,
	};
});
