import { Facebook, Twitter, Linkedin, Instagram, MessageCircle } from '@lucide/svelte';

export const SOCIAL_LINKS = [
	{
		label: 'Facebook',
		url: 'https://www.facebook.com/p/Solar-Vipani-61556033262509/',
		icon: Facebook
	},
	{
		label: 'Twitter',
		url: 'https://x.com/Solarvipani',
		icon: Twitter
	},
	{
		label: 'LinkedIn',
		url: 'https://www.linkedin.com/company/solar-vipani/',
		icon: Linkedin
	},
	{
		label: 'Instagram',
		url: 'https://www.instagram.com/solar.vipani/',
		icon: Instagram
	},
	{
		label: 'WhatsApp',
		url: 'https://wa.me/918983066701',
		icon: MessageCircle
	}
];

export function scrollToElement(elementId: string): void {
	const element = document.getElementById(elementId);
	if (element) {
		element.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	}
}
