import { dev, version } from '$app/environment';
import { encodeTemplateAndSendEMail } from './messages';
import RegistrantSubmission from '$lib/emails/RegistrantSubmission.svelte';
import ApplicantSubmission from '$lib/emails/ApplicantSubmission.svelte';
import SubscriberSubmission from '$lib/emails/SubscriberSubmission.svelte';
import FeedbackSubmission from '$lib/emails/FeedbackSubmission.svelte';
import { fail, redirect } from '@sveltejs/kit';
import {
	TYPES as GOOGLE_TYPES,
	createPerson,
	getVerificationCodeByResourceName,
	addPersonToContactGroup,
	removePersonFromContactGroup,
	//searchPersonsByEmailAddress,
	searchPersonByEmailAddress
} from './api/GoogleAPI';
import { VERIFICATIONCODE_NUM } from '$lib/consts.js';

/** @param {import('@sveltejs/kit').RequestEvent} event */
export async function addRegistrantFromRequestEvent({ request, cookies }) {
	const formData = await request.formData();

	const givenName = /** @type {string} */ String(formData.get('givenName')).trim();
	const familyName = /** @type {string} */ String(formData.get('familyName')).trim();
	const petCount = Number(formData.get('petCount'));
	const postalCode = /** @type {string} */ String(formData.get('postalCode')).trim();
	const streetAddress = /** @type {string} */ String(formData.get('streetAddress')).trim();
	const phoneNumber = /** @type {string} */ (formData.get('phoneNumber'));
	const emailAddress = /** @type {string} */ (formData.get('emailAddress'));
	const recurring = /** @type {boolean} */ (formData.get('recurring') == 'true');
	const startDate = /** @type {string} */ (formData.get('startDate'));
	const endDate = /** @type {string} */ (formData.get('endDate'));
	const agreed = /** @type {boolean} */ (formData.get('agreed') == 'true');
	const subscribe = /** @type {boolean} */ (formData.get('subscribe') == 'true');
	const interests = /** @type {string[]} */ (formData.getAll('interests'));
	const schedule = /** @type {string[]} */ (formData.getAll('schedule'));
	const referrer = /** @type {string[]} */ (formData.getAll('referrer'));
	const pets = Array.from({ length: petCount }).map((_, index) => {
		return {
			name: /** @type {string} */ (formData.get(`pets.${index}.name`)),
			age: /** @type {number} */ Number(formData.get(`pets.${index}.age`)),
			ageScale: /** @type {import('$lib/consts.js').AgeScaleTypes} */ (
				formData.get(`pets.${index}.ageScale`)
			),
			gender: /** @type {string} */ (formData.get(`pets.${index}.gender`)),
			type: /** @type {string} */ (formData.get(`pets.${index}.type`)),
			size: /** @type {number} */ Number(formData.get(`pets.${index}.size`)),
			description: /** @type {string} */ (formData.get(`pets.${index}.description`)),
			features: /** @type {string[]} */ (formData.getAll(`pets.${index}.features`))
		};
	});

	//TODO Registrant validate entries here

	/** @type {Registrant} */
	let registrant = {
		givenName,
		familyName,
		postalCode,
		streetAddress,
		phoneNumber,
		emailAddress,
		startDate,
		endDate,
		recurring,
		agreed,
		subscribe,
		interests,
		schedule,
		referrer,
		pets
	};
	registrant.serviceable = isPostalCodeInServiceArea(postalCode);
	const verificationCode = generateVerificationCode();

	// create Person object for Google People API
	/** @type {import('googleapis').people_v1.Schema$Person} */
	const personBody = {
		names: [{ givenName, familyName }],
		nicknames: [],
		emailAddresses: [{ value: emailAddress, type: GOOGLE_TYPES.HOME }],
		phoneNumbers: [{ value: phoneNumber, type: GOOGLE_TYPES.HOME }],
		addresses: [{ postalCode, streetAddress, type: GOOGLE_TYPES.HOME }],
		interests: interests.map((interest) => {
			return { value: interest };
		}),
		relations: [{ person: referrer.join(' '), type: GOOGLE_TYPES.REFERREDBY }],
		userDefined: [
			{ key: 'Agreed', value: agreed ? new Date().toDateString() : 'false' },
			{
				key: 'Schedule',
				value: `${startDate} ${recurring ? 'to ' + endDate : 'recurringly'} ${schedule.join(',')}`
			},
			{ key: 'Version', value: version },
			{
				key: GOOGLE_TYPES.VERIFICATIONCODE,
				value: verificationCode
			}
		]
		//memberships: [{contactGroupMembership: {contactGroupResourceName: "REGISTRANT"}}]
	};

	pets?.forEach(({ name, age, ageScale, gender, type, size, description, features }) => {
		personBody.nicknames?.push({ value: name, type: GOOGLE_TYPES.NICKNAMES });
		personBody.userDefined?.push({
			key: 'Pet',
			value: `${name} is a ${age} ${ageScale} ${gender} ${type} weighing ${size} is described as ${description} and is ${features.join(
				', '
			)}`
		});
	});

	/** @type {import('googleapis').people_v1.Schema$Person} */
	const person = await createPerson(personBody);

	if (person.resourceName) {
		let userId = resourceNameToId(person.resourceName);
		await encodeTemplateAndSendEMail(
			RegistrantSubmission,
			`${registrant.givenName} ${registrant.familyName}<${registrant.emailAddress}>`,
			{ hostName: String(request.headers.get('origin')), userId, verificationCode, ...registrant }
		);
		await addPersonToContactGroup(person.resourceName, 'Clients');
		if (registrant.subscribe) await addPersonToContactGroup(person.resourceName, 'Subscribed');
		console.info(`Registration submitted for ${emailAddress}`);
		cookies.set('userId', userId, { path: '/', maxAge: 60 * 60 * 1 });
		throw redirect(302, `/verify?userId=${userId}`);
	}

	return fail(400, { dev, ...registrant }); //: 'Unable to sign you up'
}

/** @param {import('@sveltejs/kit').RequestEvent} event */
export async function addApplicantFromRequestEvent({ request, cookies }) {
	const formData = await request.formData();
	const givenName = /** @type {string} */ (formData.get('givenName'));
	const familyName = /** @type {string} */ (formData.get('familyName'));
	const postalCode = /** @type {string} */ (formData.get('postalCode'));
	const streetAddress = /** @type {string} */ (formData.get('streetAddress'));
	const phoneNumber = /** @type {string} */ (formData.get('phoneNumber'));
	const emailAddress = /** @type {string} */ (formData.get('emailAddress'));
	const startDate = /** @type {string} */ (formData.get('startDate'));
	const subscribe = /** @type {boolean} */ (formData.get('subscribe') == 'true');
	const agreed = /** @type {boolean} */ (formData.get('agreed') == 'true');
	const interests = /** @type {string[]} */ (formData.getAll('interests'));
	const schedule = /** @type {string[]} */ (formData.getAll('schedule'));
	const referrer = /** @type {string[]} */ (formData.getAll('referrer'));
	const salary = /** @type {string} */ (formData.get('salary'));
	const experience = /** @type {string} */ (formData.get('experience'));
	const details = /** @type {string} */ (formData.get('details'));
	const authorized = /** @type {boolean} */ (formData.get('authorized') == 'true');
	const felony = /** @type {boolean} */ (formData.get('felony') == 'true');

	//TODO Applicant validate entries here
	/** @type {Applicant} */
	let applicant = {
		givenName,
		familyName,
		streetAddress,
		postalCode,
		emailAddress,
		phoneNumber,
		interests,
		schedule,
		startDate,
		referrer,
		salary,
		experience,
		details,
		authorized,
		felony,
		agreed,
		subscribe
	};

	const verificationCode = generateVerificationCode();

	/** @type {import('googleapis').people_v1.Schema$Person} */
	const personBody = {
		names: [{ givenName, familyName }],
		emailAddresses: [{ value: emailAddress, type: GOOGLE_TYPES.HOME }],
		phoneNumbers: [{ value: phoneNumber, type: GOOGLE_TYPES.HOME }],
		addresses: [{ postalCode, streetAddress, type: GOOGLE_TYPES.HOME }],
		interests: interests.map((interest) => {
			return { value: interest };
		}),
		relations: [{ person: referrer.join(' '), type: GOOGLE_TYPES.REFERREDBY }],
		userDefined: [
			{ key: 'Agreed', value: agreed ? new Date().toDateString() : 'false' },
			{ key: 'Is Authorized', value: authorized.toString() },
			{ key: 'Has Felony', value: felony.toString() },
			{ key: 'Salary Request', value: salary },
			{ key: 'Schedule', value: `${startDate} ${schedule.join(',')}` },
			{ key: 'Version', value: version },
			{
				key: GOOGLE_TYPES.VERIFICATIONCODE,
				value: verificationCode
			}
		],
		biographies: [{ value: `${experience}\n\n${details}`, contentType: 'TEXT_PLAIN' }]
		//memberships: [{contactGroupMembership: {contactGroupResourceName: "APPLICANT"}}],
	};

	// if (dev) {
	// 	console.dir(personBody);
	// 	await new Promise((r) => setTimeout(r, 2000));
	// 	return fail(400, {
	// 		error: 'There was an error submitting your form.',
	// 		errorField: 'startDate',
	// 		...applicant
	// 	});
	// }

	try {
		/** @type {import('googleapis').people_v1.Schema$Person} */
		const person = await createPerson(personBody);
		if (person.resourceName) {
			let userId = resourceNameToId(String(person.resourceName));
			await encodeTemplateAndSendEMail(
				ApplicantSubmission,
				`${applicant.givenName} ${applicant.familyName}<${applicant.emailAddress}>`,
				{ hostName: String(request.headers.get('origin')), userId, verificationCode, ...applicant }
			);
			await addPersonToContactGroup(person.resourceName, 'Clients');
			if (applicant.subscribe) await addPersonToContactGroup(person.resourceName, 'Subscribed');
			console.info(`Application submitted for ${emailAddress}`);
			cookies.set('userId', userId, { path: '/team/apply/verify', maxAge: 60 * 60 * 1 });
		}
	} catch (error) {
		console.error(error);
		return fail(400, { error, dev, ...applicant }); //: 'Unable to apply'
	}
	throw redirect(302, `/team/apply/verify`);
}

/** @param {import('@sveltejs/kit').RequestEvent} event */
export async function addSubscriberFromRequestEvent({ request }) {
	const formData = await request.formData();
	const givenName = /** @type {string} */ String(formData.get('givenName'));
	const emailAddress = /** @type {string} */ String(formData.get('emailAddress'));
	const postalCode = /** @type {string} */ String(formData.get('postalCode'));

	//TODO Subscriber validate entries here

	/** @type {Subscriber} */
	let subscriber = {
		givenName,
		emailAddress,
		postalCode
	};

	const verificationCode = generateVerificationCode();

	/** @type {import('googleapis').people_v1.Schema$Person} */
	const personBody = {
		names: [{ givenName }],
		emailAddresses: [{ value: emailAddress, type: GOOGLE_TYPES.HOME }],
		addresses: [{ postalCode, type: GOOGLE_TYPES.HOME }],
		userDefined: [
			{ key: 'Agreed', value: new Date().toDateString() },
			{
				key: GOOGLE_TYPES.VERIFICATIONCODE,
				value: verificationCode
			}
		]
		//memberships: [{contactGroupMembership: {contactGroupResourceName: "SUBSCRIBER"}}]
	};

	try {
		let person = await searchPersonByEmailAddress(emailAddress);
		if (!person) person = await createPerson(personBody);
		if (person.resourceName) {
			let userId = resourceNameToId(person.resourceName);
			await encodeTemplateAndSendEMail(
				SubscriberSubmission,
				`${subscriber.givenName}<${subscriber.emailAddress}>`,
				{ hostName: String(request.headers.get('origin')), userId, verificationCode, ...subscriber }
			);
			console.info(`Subscription submitted for ${emailAddress}`);
			await addPersonToContactGroup(person.resourceName, 'Subscribed');
			return { success: true };
		}
	} catch (error) {
		console.error(error);
		return fail(500, { error, dev, ...subscriber }); //: 'Unable to subscribe'
	}
}

/** @param {import('@sveltejs/kit').RequestEvent} event */
export async function feedbackFromRequestEvent({ request, params }) {
	const { teamId } = params;
	if (!teamId) return fail(500, { error: 'No team member selected' });

	const formData = await request.formData();
	const name = /** @type {string} */ (formData.get('name'));
	const rating = /** @type {number} */ Number(formData.get('rating'));
	const message = /** @type {string} */ (formData.get('message'));

	/** @type {TeamRater} */
	let rater = {
		teamId,
		name,
		rating,
		message
	};

	try {
		await encodeTemplateAndSendEMail(
			FeedbackSubmission,
			`Eola Pets ${rater.teamId}<rating@eolapets.com>`,
			{ hostName: String(request.headers.get('origin')), ...rater }
		);
		console.info(`Feedback submitted for ${name} ${rating}`);
		//await new Promise(r => setTimeout(r, 2000));
		return { success: true };
	} catch (error) {
		console.error(error);
		return fail(400, { error, ...rater }); //: 'Unable to submit.\nPlease try again later.'
	}
}

/** @param {import('@sveltejs/kit').RequestEvent} event */
export async function verifyFromRequestEvent({ request, cookies }) {
	const formData = await request.formData();
	const userId = /** @type {string} */ (formData.get('userId'));
	const code = /** @type {string} */ (formData.get('code'));
	//const redirectURI = /** @type {string} */ url.pathname;
	const resourceName = idToResourceName(userId);

	//TODO Verification test if already verified
	try {
		const test = await getVerificationCodeByResourceName(resourceName);

		if (test && code === test) {
			await addPersonToContactGroup(resourceName, 'Verified');
			console.info(`Verification successful for ${userId}`);
			cookies.delete('userId', { path: '/' });
			return { verified: true };
		} else {
			console.error(`Verification failed for ${userId}`);
			return fail(402, { error: 'Verification code is incorrect. Try again.', userId });
		}
	} catch (error) {
		console.error(`Verification failed for ${userId}`, error);
		return fail(400, { error: 'Unable to verify. Please try again.', userId });
	}
}

/** @param {import('@sveltejs/kit').RequestEvent} event */
export async function scheduleFromRequestEvent({ request }) {
	const formData = await request.formData();
	const userId = formData.get('userId');

	try {
		console.log(userId);
	} catch (error) {
		console.error(error);
		return fail(400, { error, userId }); //: 'Problem scheduling'
	}
}

/** @param {string} emailAddress */
export async function unsubscribeUserByEmailAddress(emailAddress) {
	const person = await searchPersonByEmailAddress(emailAddress);
	if (person && person.resourceName) {
		return await removePersonFromContactGroup(person.resourceName, 'Subscribed');
	}
	return false;
}

//TODO Postal code filter based on service offering
/** @param {string} postalCode, @returns {boolean} */
export function isPostalCodeInServiceArea(postalCode) {
	return ['32801', '32803', '32804', '32806'].includes(postalCode);
}

//utils
const RESOURCENAME_PREFIX = 'people/c';
/** @param {string} id, @returns {string} */
function idToResourceName(id) {
	return String(RESOURCENAME_PREFIX + id);
}

/** @param {string} resourceName, @returns {string} */
function resourceNameToId(resourceName) {
	return String(resourceName).slice(RESOURCENAME_PREFIX.length);
}

/** @param {number} num, @returns {string} */
function generateVerificationCode(num = VERIFICATIONCODE_NUM) {
	return [...Array(num)].map(() => (Math.random() * 10) | 0).join('');
}
