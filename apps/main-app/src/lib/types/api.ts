export interface LeadData {
	name: string;
	phone: string;
	pinCode?: string;
	type?: string;
	comment?: string;
	urlParam?: string;
	email?: string;
	reference_uuid?: string;
	district?: string;
}

export interface BusinessLoginRequest {
	email: string;
	password: string;
}

export interface APIResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface EmailOptions {
	to?: string;
	recipients?: string | string[];
	subject: string;
	message?: string;
	html?: string;
	text?: string;
	from?: string;
	isHtml?: boolean;
	senderName?: string;
	senderEmail?: string;
}

export interface EmailResult {
	success: boolean;
	error?: string;
	messageId?: string;
	code?: string;
	recipients?: string[];
	results?: Array<{
		recipient: string;
		success: boolean;
		error?: string;
		messageId?: string;
	}>;
}

export interface BusinessData {
	businessName: string;
	address: string;
	plusCode?: string;
	phoneNumber: string;
	whatsappNumber?: string;
	email: string;
	login_email: string;
	website?: string;
	gstn: string;
	state: string;
	district: string;
	city: string;
}

export interface Story {
	[key: string]: unknown;
}
