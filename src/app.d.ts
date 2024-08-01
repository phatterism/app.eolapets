// Types https://kit.svelte.dev/docs/types#app
declare global {
	namespace App {
		// interface Error {
		// 	message: unknown;
		// 	errorId: string;
		// }
		interface Locals {
			userid: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	interface Navigator {
		standalone: boolean;
	}
}

export {};
