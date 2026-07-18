import type { Session } from '@auth/sveltekit';

// Svelte 5 runes ($state, $derived, $effect, $props, $bindable, $inspect, $host) are
// declared globally by the `svelte` package — no hand-rolled ambient shims needed here.

declare global {
	namespace App {
		interface Locals {
			session: Session | null;
			user: {
				id: string;
				email: string;
				role: string;
			} | null;
		}

		// Optional: no root layout load provides these, so most pages have neither.
		interface PageData {
			session?: Session | null;
			user?: App.Locals['user'];
		}

		interface Error {
			message: string;
			code?: string;
		}
	}
}

export {};
