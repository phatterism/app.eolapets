////////////////////////////////////////////////////////////////////////////////
//
//  robots.txt
//  Genereates the correct robots.txt
//
////////////////////////////////////////////////////////////////////////////////

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET() {
	return new Response(
		`User-agent: *
Allow: /

# Google adsbot ignores robots.txt unless specifically named!
User-agent: AdsBot-Google
Allow: /


User-agent: GPTBot
Disallow: /
`.trim()
	);
}
