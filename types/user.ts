import type { IShop } from "./shop";

export enum UserRole {
	USER = "user",
	ADMIN = "admin",
}

export interface RequestedProduct {
	product: string; // String representing the product's ObjectId
	store: string; // String representing the store's ObjectId
}

export interface IUser {
	_id?: string;
	firebaseUserId: string;
	role: UserRole;
	email: string;
	firstName: string;
	lastName: string;
	nickname: string;
	lastCoordinates: [number, number]; // [latitude, longitude]
	stores?: IShop[]; // Array of store objects, DO NOT USE FROM HERE - USE ShopsStore
	storesId?: string[]; // Array of store IDs
	requested_products: RequestedProduct[]; // Array of requested products with store references
	chatsInitiated: { shopId: string; chatFirebaseId: string }[];
	updatedAt: Date;
}

export interface IRegisterUser {
	email: string;
	password: string;
}
