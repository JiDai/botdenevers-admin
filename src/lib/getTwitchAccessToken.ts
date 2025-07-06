import { TwitchAuthResponse } from '@/types/twitch';

export async function getTwitchAccessToken(): Promise<string> {
	const response = await fetch(`${process.env.TWITCH_API_TOKEN_URL}token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: process.env.TWITCH_APP_CLIENT_ID!,
			client_secret: process.env.TWITCH_APP_CLIENT_SECRET!,
			grant_type: 'client_credentials'
		})
	});

	const data: TwitchAuthResponse = await response.json();
	return data.access_token;
}
