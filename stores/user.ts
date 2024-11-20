import { ref } from "vue";
import { defineStore } from "pinia";
import type { IUser, RequestedProduct, IRegisterUser } from "@/types/user";
import { UserRole } from "@/types/user";

export const useUserStore = defineStore("user", () => {
	const config = useRuntimeConfig();
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
		registerUser,
		updateUser,
		addRequestedProduct,
	};
});
