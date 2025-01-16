import { ref } from "vue";
import { defineStore } from "pinia";
import { useFirebaseAuth } from "vuefire";
import { signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, sendPasswordResetEmail } from "firebase/auth";
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
		nickname: "",
		stores: [],
		requested_products: [],
		chatsInitiated: [],
		lastCoordinates: [0, 0],
		updatedAt: new Date(),
	});
	// const authToken = ref<string | null>(null);
	const loggedIn = useLocalStorage<boolean>("loggedIn", false);
	const isAdmin = ref<boolean>(false);
	const hasShop = ref<boolean>(false);
	const shopIds = ref<string[]>([]);
	const shopsStore = useShopsStore();

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
			// Set persistence to local to keep the user logged in between sessions
			await setPersistence(auth, browserLocalPersistence);
			const response = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
			firebaseUserId.value = response.user.uid;
			console.log("firebaseUserId:", firebaseUserId.value);
			// get the user from mongodb according to the firebaseUserId
			const userResponse: IUser = await getUser(firebaseUserId.value);
			loadUser(userResponse);
		}
		catch (error) {
			console.error("Error logging in user:", error);
			throw error;
		}
	}

	async function loginWithGoogle() {
		try {
			const provider = new GoogleAuthProvider();
			const response = await signInWithPopup(auth, provider);
			firebaseUserId.value = response.user.uid;

			// Check if the user exists in MongoDB
			const userResponse = await checkIfUserExists(firebaseUserId.value);

			if (!userResponse) {
				return {
					isNewUser: true,
					email: response.user.email || "",
					firebaseUserId: firebaseUserId.value,
				};
			}

			// If user exists, load user data
			loadUser(userResponse);
		}
		catch (error) {
			console.error("Error logging in with Google:", error);
			throw error;
		}
	}

	async function loginWithFacebook() {
		try {
			const provider = new FacebookAuthProvider();
			const response = await signInWithPopup(auth, provider);
			firebaseUserId.value = response.user.uid;

			// Check if the user exists in MongoDB
			const userResponse = await checkIfUserExists(firebaseUserId.value);

			if (!userResponse) {
				return {
					isNewUser: true,
					email: response.user.email || "",
					firebaseUserId: firebaseUserId.value,
				};
			}

			// If user exists, load user data
			loadUser(userResponse);
		}
		catch (error) {
			console.error("Error logging in with Facebook:", error);
			throw error;
		}
	}

	async function checkIfUserExists(firebaseUserId: string): Promise<IUser | null> {
		try {
			const token = await auth.currentUser?.getIdToken();

			const response = await $fetch<IUser | null>(`${config.public.apiBaseUrl}/api/users/${firebaseUserId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
			});

			return response;
		}
		catch {
			// User not found
			return null;
		}
	}

	async function registerSocialUser(nickname: string, email: string, firebaseUserId: string) {
		try {
			const newUser = {
				nickname,
				email,
				firebaseUserId, // Send the Firebase UID to the backend
			};

			const response = await $fetch<IUser>(`${config.public.apiBaseUrl}/api/users/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newUser),
			});

			loadUser(response);
		}
		catch (error) {
			console.error("Error registering social user:", error);
			throw error;
		}
	}

	function loadUser(userResponse: IUser) {
		if (userResponse.role === UserRole.ADMIN) {
			isAdmin.value = true;
		}
		console.log("userResponse:", userResponse);
		user.value = userResponse;
		console.log("last coordinates of the logged in user:", userResponse.lastCoordinates);
		if (userResponse.lastCoordinates && userResponse.lastCoordinates[0] !== 0 && userResponse.lastCoordinates[1] !== 0) {
			userLocation.value = userResponse.lastCoordinates;
		}
		userLocation.value = userResponse.lastCoordinates;
		console.log("user location right after the user log ins", userLocation.value);
		updateShopData(userResponse);
		if (shopsStore.userShop) {
			console.log("user shop location:", shopsStore.userShop.location.coordinates);
			userLocation.value = shopsStore.userShop.location.coordinates;
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

	async function forgotPassword(email: string) {
		try {
			await sendPasswordResetEmail(auth, email);
			console.log("Password reset email sent.");
		}
		catch (error) {
			console.error("Error sending password reset email:", error);
			throw error;
		}
	}

	async function logOutUser() {
		await signOut(auth); // Log out from Firebase
		user.value = {
			firebaseUserId: "",
			role: UserRole.USER,
			email: "",
			firstName: "",
			lastName: "",
			nickname: "",
			stores: [],
			lastCoordinates: [0, 0],
			requested_products: [],
			chatsInitiated: [],
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
				updateShopData(response);
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

	function updateShopData(userResponse: IUser) {
		if (userResponse.stores && userResponse.stores.length > 0) {
			// this app version only allows one shop per user
			const shopObj = userResponse.stores[0];
			const shopId = shopObj._id;
			// represents the user shop id in array format for future use -
			// when the app is updated to allow multiple shops per user
			shopIds.value = [shopId];
			shopsStore.userShop = shopObj;

			hasShop.value = true;
		}
	}

	const getChatId = (shopId: string) => {
		return user?.value.chatsInitiated.find(chat => chat.shopId === shopId)?.chatFirebaseId;
	};

	return {
		user,
		hasShop,
		userLocation,
		auth,
		loggedIn,
		logOutUser,
		registerUser,
		registerSocialUser,
		loginUser,
		loginWithGoogle,
		loginWithFacebook,
		forgotPassword,
		updateUser,
		addRequestedProduct,
		firebaseUserId,
		getUser,
		getRole,
		getChatId,
		isAdmin,
		shopIds,
		updateShopData,
		loadUser,
	};
});
