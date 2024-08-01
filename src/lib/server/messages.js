//https://svelte-email.vercel.app/docs/utilities/render
/**
 * @typedef {Object} TemplateData
 * @property {string} hostName - required
 * @property {string} [userId] - optional
 * @property {string} [verificationCode] - optional
 */

import { sendEmail } from './api/GoogleAPI';

/** @param {any} emailTemplate, @param {string} to, @param {TemplateData} data */
export async function encodeTemplateAndSendEMail(emailTemplate, to, data) {
	const from = ~data.hostName.indexOf('eolapets.com')
		? `Eola Pets <hello@eolapets.com>`
		: `Eola Pets Dev <eolapetsdev@gmail.com>`;
	const { html, css, head } = emailTemplate.render(data);

	const subject = /<title>(.*?)<\/title>/g.exec(head)?.[1];
	const text = html.replace(/(<([^>]+)>)/gi, '');

	const encoded = Buffer.from(
		`From: ${from}\r\n\
To:${to}\r\n\
Subject:${subject}\r\n\
Content-Type:multipart/alternative;boundary="Y0L0"\r\n\r\n--Y0L0\r\n\
Content-Type:text/plain;charset=UTF-8\r\n\r\n\
${text}r\n\r\n--Y0L0\r\n\
Content-Type:text/html;charset=UTF-8\r\n\r\n\
<!doctype html><html><head>${head}<style>${css}</style></head>${html}</html>\r\n\r\n--Y0L0--`,
		'ascii'
	)
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
	return await sendEmail(encoded);
}
