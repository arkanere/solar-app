/**
 * Business listing tracking and action utilities
 * Handles Umami event tracking and phone/WhatsApp actions
 */

/**
 * Track Umami event for business interactions
 */
export function trackBusinessEvent(eventName: string) {
	if (typeof window !== 'undefined' && window.umami) {
		window.umami.track(eventName);
	}
}

/**
 * Initiate a call to business phone number
 */
export function makeCall(phoneNumber: string, businessCity: string, businessSlug: string) {
	trackBusinessEvent(`${businessCity}-call-now-button-${businessSlug}`);
	window.location.href = `tel:${phoneNumber}`;
}

/**
 * Open WhatsApp chat with business
 */
export function openWhatsApp(phoneNumber: string, businessCity: string, businessSlug: string) {
	trackBusinessEvent(`${businessCity}-whatsapp-button-${businessSlug}`);
	const cleanPhone = phoneNumber.replace(/\D/g, '');
	window.location.href = `https://wa.me/91${cleanPhone}`;
}
