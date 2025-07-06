import { urlJoin } from 'url-join-ts';

export async function TwitchCall(path: string, params: Record<string, string>, accessToken: string) {
	const url = new URL(urlJoin(process.env.TWITCH_API_URL!, path));
	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			url.searchParams.append(key, value);
		});
	}

	const options = {
		method: 'GET',
		headers: {
			'Client-ID': process.env.TWITCH_APP_CLIENT_ID!,
			Authorization: `Bearer ${accessToken}`,
		},
	};

	const response = await fetch(url, options);

	console.log(`accessToken: `, accessToken);
	if (response.ok) {
		return response.json();
	} else {
		console.error(`response: `, response);
		throw new Error(`HTTP error! status: ${response.status}`);
	}
}
