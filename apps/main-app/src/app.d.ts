import type { Session } from '@auth/sveltekit';

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

		interface PageData {
			session: Session | null;
			user: App.Locals['user'];
		}

		interface Error {
			message: string;
			code?: string;
		}
	}
}

export {};
