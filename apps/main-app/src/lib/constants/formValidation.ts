export interface ValidationErrors {
	name: string;
	phone: string;
	message?: string;
	pincode: string;
	email?: string;
	comment?: string;
	type?: string;
}

export function validateQueryForm(
	name: string,
	phone: string,
	message: string,
	pincode: string
): { isValid: boolean; errors: ValidationErrors } {
	const errors: ValidationErrors = {
		name: '',
		phone: '',
		message: '',
		pincode: ''
	};

	let isValid = true;

	if (name.trim() === '') {
		errors.name = 'Name is required';
		isValid = false;
	}

	if (!/^\d{10,16}$/.test(phone)) {
		errors.phone = 'Phone number must be between 10 and 16 digits';
		isValid = false;
	}

	if (message.trim() === '') {
		errors.message = 'Message is required';
		isValid = false;
	}

	if (!/^\d{6}$/.test(pincode)) {
		errors.pincode = 'Pincode must be a 6-digit number';
		isValid = false;
	}

	return { isValid, errors };
}

export interface LeadFormErrors {
	name: string;
	phone: string;
	pinCode: string;
	email: string;
	type: string;
	comment: string;
}

export function validateLeadForm(
	name: string,
	phone: string,
	pinCode: string,
	email: string,
	type: string,
	comment: string
): { isValid: boolean; errors: LeadFormErrors } {
	const errors: LeadFormErrors = {
		name: '',
		phone: '',
		pinCode: '',
		email: '',
		type: '',
		comment: ''
	};

	let isValid = true;

	if (name.trim() === '') {
		errors.name = 'Name is required';
		isValid = false;
	}

	if (!/^\+?\d{10,16}$/.test(phone)) {
		errors.phone = 'Phone number must be between 10 and 16 digits, optionally starting with +';
		isValid = false;
	}

	if (!/^\d{6}$/.test(pinCode)) {
		errors.pinCode = 'Pin code must be exactly 6 digits';
		isValid = false;
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		errors.email = 'Invalid email address';
		isValid = false;
	}

	if (type.trim() === '') {
		errors.type = 'Type is required';
		isValid = false;
	}

	if (comment.trim() === '') {
		errors.comment = 'Comment is required';
		isValid = false;
	}

	return { isValid, errors };
}

export function validatePhone(phone: string): boolean {
	return /^\+?\d{10,16}$/.test(phone);
}

export function validateEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePinCode(pinCode: string): boolean {
	return /^\d{6}$/.test(pinCode);
}

export function validatePhoneNumber(phone: string): boolean {
	return /^\d{10,16}$/.test(phone);
}

export function validateGSTN(gstn: string): boolean {
	return /^[0-9A-Z]{15}$/.test(gstn);
}
