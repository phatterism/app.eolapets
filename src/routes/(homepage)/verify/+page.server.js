import { verifyFromRequestEvent } from '$lib/server/users';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const userId = cookies.get('userId');
	const verified = cookies.get('verified');
	return {
		userId,
		verified
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	verify: verifyFromRequestEvent
};
