import type { IProduct } from "./product";

export interface IShop {
	_id?: string;
	owner: string; // User ID as a string
	name: string;
	description: string;
	location: {
		type: string;
		coordinates: [number, number]; // [longitude, latitude]
	};
	address: {
		street: string;
		houseNumber: string;
		apartment?: string;
		postalCode: string;
		city: string;
	};
	products: IProduct[]; // Array of products (IProduct interface)
	createdAt: Date;
	updatedAt: Date;
}
