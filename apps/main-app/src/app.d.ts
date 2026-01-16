import type { Session } from '@auth/sveltekit';

declare global {
	function $state<T>(initial: T): T;
	function $state<T>(initial?: undefined): T | undefined;

	function $effect(fn: () => void | (() => void)): void;
	function $effect.pre(fn: () => void | (() => void)): void;

	function $derived<T>(fn: () => T): T;
	function $derived.by<T>(fn: () => T): T;

	function $props(): any;
	function $bindable<T>(initial?: T): T;

	function $inspect<T>(value: T): T;

	function $host(): HTMLElement;

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
