export interface IProduct {
	_id?: string;
	name: string;
	description: string;
	price: number;
	imageUrl: string;
	status: "available" | "reserved" | "sold" | "hidden";
	requestQueue: { user: string; timestamp: Date }[];
	// reservedFor: string | null;
	// reservedExpiration: Date | null;
	soldTo?: string;
}
