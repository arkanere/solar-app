import { capture } from '$lib/posthog';

declare global {
	interface Window {
		umami?: {
			track: (eventName: string) => void;
		};
	}
}

export function trackBusinessEvent(eventName: string) {
	if (typeof window !== 'undefined' && window.umami) {
		window.umami.track(eventName);
	}
}

export function makeCall(phoneNumber: string, businessCity: string, businessSlug: string) {
	trackBusinessEvent(`${businessCity}-call-now-button-${businessSlug}`);
	capture('call_initiated', { business_slug: businessSlug, city: businessCity });
	window.location.href = `tel:${phoneNumber}`;
}

export function openWhatsApp(phoneNumber: string, businessCity: string, businessSlug: string) {
	trackBusinessEvent(`${businessCity}-whatsapp-button-${businessSlug}`);
	capture('whatsapp_initiated', { business_slug: businessSlug, city: businessCity });
	const cleanPhone = phoneNumber.replace(/\D/g, '');
	window.location.href = `https://wa.me/91${cleanPhone}`;
}
