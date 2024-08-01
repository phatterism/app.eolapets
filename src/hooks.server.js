// RE-ROUTING FOR SIGNUP

/** @type {Record<string, string>} */
const translated = {
	'/bakery': '/retail/bakery',
	'/training': '/services/training',
	'/camp': '/service/camp',
	'/join-our-team': '/team/apply',
	'request-info': '/signup'
	//'/': '/signup' //temporarily for sign-up
};

/** @type {import('@sveltejs/kit').Reroute} */
export function reroute({ url }) {
	if (url.pathname in translated) {
		console.info(`hooks.js [redirected] "${url.pathname}" ➜ "${translated[url.pathname]}"`);
		return translated[url.pathname];
	}
}

// https://github.com/ciscoheat/sveltekit-rate-limiter
export const handle = async ({ event, resolve }) => {
	const { url } = event;

	//Legacy redirects
	if (url.pathname === '/bakery')
		return new Response('Redirect', { status: 301, headers: { Location: '/retail/bakery' } });
	else if (url.pathname === '/training')
		return new Response('Redirect', { status: 301, headers: { Location: '/services/training' } });
	else if (url.pathname === '/camp')
		return new Response('Redirect', { status: 301, headers: { Location: '/services/camp' } });
	else if (url.pathname === '/join-our-team')
		return new Response('Redirect', { status: 301, headers: { Location: '/team/apply' } });
	else if (url.pathname === '/request-info')
		return new Response('Redirect', { status: 301, headers: { Location: '/signup' } });
	else if (url.pathname === '/login')
		return new Response('Redirect', {
			status: 302,
			headers: { Location: 'https://www.timetopet.com/portal/eolapets' }
		});

	let userid = event.cookies.get('userid');

	if (!userid) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		userid = crypto.randomUUID();
		event.cookies.set('userid', userid, { path: '/' });
	}

	event.locals.userid = userid;

	return await resolve(event);
};
