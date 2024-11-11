export interface IProduct {
	_id?: string;
	name: string;
	description: string;
	price: number;
	imageUrl: string;
	status: "available" | "reserved" | "sold" | "hidden";

	reservedFor: string | null;
	reservedExpiration: Date | null;
	soldTo?: string;
}
