import {
	addRegistrantFromRequestEvent,
	addSubscriberFromRequestEvent,
	scheduleFromRequestEvent
} from '$lib/server/users';

/** @type {import('./$types').Actions} */
export const actions = {
	signup: addRegistrantFromRequestEvent,
	schedule: scheduleFromRequestEvent,
	subscribe: addSubscriberFromRequestEvent
};

export async function load({ cookies }) {
	const userId = cookies.get('userId');
	const verified = cookies.get('verified');

	console.log('userId:', userId, ' verified:', verified);

	return {
		userId,
		verified
	};
}
