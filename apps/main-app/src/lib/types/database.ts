export interface Business {
	id: string;
	business_name: string;
	email: string;
	phone?: string;
	address?: string;
	city?: string;
	state?: string;
	country?: string;
	created_at: Date;
	updated_at: Date;
}

export interface Lead {
	id: string;
	name: string;
	phone: string;
	email?: string;
	reference_uuid: string;
	created_at: Date;
	updated_at: Date;
}

export interface Project {
	id: string;
	title: string;
	description?: string;
	images?: string[];
	created_at: Date;
	updated_at: Date;
}

export interface District {
	id: string;
	name: string;
	state_id: string;
}

export interface City {
	id: string;
	name: string;
	district_id: string;
}
