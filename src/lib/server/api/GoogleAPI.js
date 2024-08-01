import { google, Auth } from 'googleapis';

export const TYPES = {
	VERIFICATIONCODE: 'Verification Code',
	HOME: 'Home',
	REFERREDBY: 'referredBy',
	NICKNAMES: 'ALTERNATE_NAME'
};

const personFields =
	'names,nicknames,emailAddresses,phoneNumbers,addresses,interests,relations,biographies,userDefined';

export async function init() {
	//test Google API connection
	const auth = new Auth.GoogleAuth({
		keyFile: '/Users/luisjr/.config/gcloud/application_default_credentials.json',
		scopes: [
			'https://www.googleapis.com/auth/contacts',
			'https://www.googleapis.com/auth/gmail.send',
			'https://www.googleapis.com/auth/calendar',
			'https://www.googleapis.com/auth/drive.file',
			'https://www.googleapis.com/auth/tasks',
			'https://www.googleapis.com/auth/blogger'
		]
	});

	await auth.getClient();
	console.info('Google API Authorization', auth.jsonContent?.client_id);

	google.options({ auth });

	google
		.people({ version: 'v1' })
		.people.get({ resourceName: 'people/me', personFields })
		.then((result) => {
			console.info(
				`Google People API people.get \n\t[${result.data.emailAddresses?.shift()?.value}] ${result.data.names?.map((name) => name.displayName)}`
			);
		});

	google
		.people({ version: 'v1' })
		.contactGroups.list()
		.then((result) => {
			console.info(
				`Google People API contactGroups.list ${result.data.contactGroups?.map((group) => '\n\t[' + group.resourceName + '] ' + group.name)}`
			);
		});

	google
		.calendar({ version: 'v3' })
		.calendarList.list()
		.then((result) => {
			console.info(
				`Google Calendar API calendarList.list ${result.data.items?.map((calendar) => '\n\t[' + calendar.id + '] ' + calendar.summary)}`
			);
		});

	google
		.drive({ version: 'v3' })
		.files.list({ q: "mimeType='application/vnd.google-apps.folder'" })
		.then((result) => {
			console.log(
				`Google Drive API files.list ${result.data.files?.map((file) => '\n\t[' + file.id + '] ' + file.name)}`
			);
		});

	google
		.tasks({ version: 'v1' })
		.tasklists.list()
		.then((result) => {
			console.info(
				`Google Tasks API tasklists.list ${result.data.items?.map((tasklist) => '\n\t[' + tasklist.id + '] ' + tasklist.title)}`
			);
		});

	google
		.blogger({ version: 'v3' })
		.blogs.listByUser({ userId: 'self' })
		.then((result) => {
			console.log(
				`Google Blogger API blogs.listByUser ${result.data.items?.map((blog) => '\n\t[' + blog.id + '] ' + blog.name)}`
			);
		});
}

/** @type {Auth.GoogleAuth} */
let google_auth;

/** @returns {Promise<Auth.GoogleAuth>} */
const getAuth = async () => {
	if (google_auth) return google_auth;
	google_auth = new Auth.GoogleAuth({
		keyFile: '/Users/luisjr/.config/gcloud/application_default_credentials.json',
		scopes: [
			'https://www.googleapis.com/auth/contacts',
			'https://www.googleapis.com/auth/gmail.send',
			'https://www.googleapis.com/auth/calendar',
			'https://www.googleapis.com/auth/drive.file',
			'https://www.googleapis.com/auth/tasks',
			'https://www.googleapis.com/auth/blogger'
		]
	});

	await google_auth.getClient();
	console.info('Google API Authorization', google_auth.jsonContent?.client_id);

	//google.options({ auth });
	return google_auth;
};

////////////////////////////////////////////////////////////////////////////////
// Google People API - https://developers.google.com/people/api/rest
////////////////////////////////////////////////////////////////////////////////

/**
 * @param {import('googleapis').people_v1.Schema$Person} requestBody
 * @returns {Promise<import('googleapis').people_v1.Schema$Person>} */
export async function createPerson(requestBody) {
	const { data } = await google
		.people({
			version: 'v1',
			auth: await getAuth()
		})
		.people.createContact({
			requestBody,
			personFields
		});

	return data;
	//throw new Error('No person could be created.');
}

/**
 * @param {string} resourceName, @param {import('googleapis').people_v1.Schema$Person} requestBody
 * @returns {Promise<import('googleapis').people_v1.Schema$Person>}
 * */
export async function updatePerson(resourceName, requestBody) {
	const { data } = await google
		.people({
			version: 'v1',
			auth: await getAuth()
		})
		.people.updateContact({ resourceName, requestBody });
	return data;
}

// /**
//  * @param {string} emailAddress
//  * @returns {Promise<import('googleapis').people_v1.Schema$SearchResult[] | undefined>}
//  */
// export async function searchPersonsByEmailAddress(emailAddress) {
// 	const {
// 		data: { results }
// 	} = await google
// 		.people({
// 			version: 'v1',
// 			auth: await getAuth()
// 		})
// 		.people.searchContacts({
// 			query: emailAddress,
// 			readMask: 'emailAddresses'
// 		});
// 	return results;
// 	// if (results) {
// 	// 	if (results.length > 1) console.info(`Multiple persons found for ${emailAddress}`);
// 	// 	return results[0].person;
// 	// }
// 	// return null;
// }

/**
 * @param {string} emailAddress
 * @returns {Promise<import('googleapis').people_v1.Schema$Person | null | undefined>}
 */
export async function searchPersonByEmailAddress(emailAddress) {
	const {
		data: { results }
	} = await google
		.people({
			version: 'v1',
			auth: await getAuth()
		})
		.people.searchContacts({
			query: emailAddress,
			readMask: 'emailAddresses'
		});
	if (results) {
		if (results.length > 1) console.info(`Multiple persons found for ${emailAddress}`);
		return results[0].person;
	}
	return null;
}

/**
 * @param {string} resourceName
 * @returns {Promise<string | null | undefined>} */
export async function getVerificationCodeByResourceName(resourceName) {
	const {
		data: { userDefined }
	} = await google
		.people({
			version: 'v1',
			auth: await getAuth()
		})
		.people.get({
			resourceName,
			personFields: 'userDefined'
		});
	return userDefined?.find((item) => item.key == TYPES.VERIFICATIONCODE)?.value;
}

/**
 * @param {string} personResourceName, @param {string} contactGroupName
 * @returns {Promise<boolean>}
 */
export async function addPersonToContactGroup(personResourceName, contactGroupName) {
	const group = google.people({
		version: 'v1',
		auth: await getAuth()
	}).contactGroups;

	const {
		data: { contactGroups }
	} = await group.list();
	const groupResource = contactGroups?.find((group) => group.name == contactGroupName);
	if (!groupResource || !groupResource.resourceName) return false;

	const resourceName = groupResource.resourceName;
	const resourceNamesToAdd = [personResourceName];
	const { status } = await group.members.modify({
		resourceName,
		requestBody: { resourceNamesToAdd }
	});

	return status == 200;
}

/**
 * @param {string} personResourceName, @param {string} contactGroupName
 * @returns {Promise<boolean>}
 * */
export async function removePersonFromContactGroup(personResourceName, contactGroupName) {
	const group = google.people({
		version: 'v1',
		auth: await getAuth()
	}).contactGroups;

	const {
		data: { contactGroups }
	} = await group.list();
	const groupResource = contactGroups?.find((group) => group.name == contactGroupName);
	if (!groupResource || !groupResource.resourceName) return false;

	const resourceName = groupResource.resourceName;
	const resourceNamesToRemove = [personResourceName];
	const { status } = await group.members.modify({
		resourceName,
		requestBody: { resourceNamesToRemove }
	});

	return status == 200;
}

////////////////////////////////////////////////////////////////////////////////
// Google Gmail API - https://developers.google.com/gmail/api/reference/rest
////////////////////////////////////////////////////////////////////////////////
/**
 * @param {string} raw
 * @returns {Promise<boolean>}
 *  */
export async function sendEmail(raw, threadId = null) {
	const response = await google
		.gmail({
			version: 'v1',
			params: { userId: 'me' },
			auth: await getAuth()
		})
		.users.messages.send({
			requestBody: { raw, threadId }
		});

	return response.status == 200;
}

////////////////////////////////////////////////////////////////////////////////
// Google Calendar API - https://developers.google.com/calendar/api/v3/reference
////////////////////////////////////////////////////////////////////////////////
/**
 * @param {string} calendarId
 * @returns {Promise<import('googleapis').calendar_v3.Schema$Event[] | undefined>}
 */
export async function getUpcomingAvailableEventsByCalendarID(calendarId) {
	const q = '';
	const {
		data: { items }
	} = await google
		.calendar({
			version: 'v3',
			auth: await getAuth()
		})
		.events.list({ calendarId, q });
	return items;
}

/**
 * @param {string} calendarId, @param {import('googleapis').calendar_v3.Schema$Event} requestBody
 * @returns {Promise<import('googleapis').calendar_v3.Schema$Event>}
 */
export async function addEventToCalendarID(calendarId, requestBody) {
	const { data } = await google
		.calendar({
			version: 'v3',
			auth: await getAuth()
		})
		.events.insert({ calendarId, requestBody });
	return data;
}

/** @param {string} month */
export async function getEventsByMonth(month) {
	const q = '';
	month;
	const calendarId = '';
	const {
		data: { items }
	} = await google
		.calendar({
			version: 'v3',
			auth: await getAuth()
		})
		.events.list({ calendarId, q });
	return items;
}

export async function getAllCalendars() {
	const {
		data: { items }
	} = await google
		.calendar({
			version: 'v3',
			auth: await getAuth()
		})
		.calendarList.list();
	return items;
}

////////////////////////////////////////////////////////////////////////////////
// Google Drive API - https://developers.google.com/drive/api/reference/rest/v3
////////////////////////////////////////////////////////////////////////////////
/**
 * @param {string} id, @param {any} body
 * @return {Promise<import('googleapis').drive_v3.Schema$File>}
 */
export async function uploadFileToFolder(id, body) {
	const mimeType = 'jpeg/image';
	const { data } = await google
		.drive({
			version: 'v3',
			auth: await getAuth()
		})
		.files.create({ requestBody: { id, mimeType }, media: { body } });
	//.files.insert({ requestBody: { id, mimeType  }, media: {body} });
	return data;
}

////////////////////////////////////////////////////////////////////////////////
// Helper Utils

/** @param {string | null} dateStr */
export function formatToGoogleDate(dateStr = null) {
	const date = dateStr ? new Date(dateStr) : new Date();
	return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}
