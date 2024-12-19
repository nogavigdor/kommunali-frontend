export interface AutofillData {
	features: Array<{
		properties: {
			street: string; // street name
			address_number: string; // house number
			address_level2: string; // city
			postcode: string; // postal code
			country: string; // country
		};
		geometry: {
			coordinates: [number, number];
		};
	}>;
}
