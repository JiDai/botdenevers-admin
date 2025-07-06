// Env
// TWITCH_API_TOKEN_URL=https://id.twitch.tv/oauth2/
// TWITCH_API_URL=https://api.twitch.tv/helix/
// TWITCH_API_REFRESH_TOKEN=65o658xqhvo84i4xi8eadu9q52y8545qdwt91c8pb6ru54rqe1
//
// # Twitch app configuration
// TWITCH_APP_CLIENT_ID=7dauhza7t52wsoa2hqr0yrk37fu6np
// TWITCH_APP_CLIENT_SECRET=7nrwr1va5duosyzgf6zi8uytxc8w0e

import { NextResponse } from 'next/server';
import { getTwitchAccessToken } from '@/lib/getTwitchAccessToken';

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get('query');

		if (!query) {
			return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
		}

		const accessToken = await getTwitchAccessToken();

		const igdbResponse = await fetch('https://api.igdb.com/v4/games', {
			method: 'POST',
			headers: {
				'Client-ID': process.env.TWITCH_APP_CLIENT_ID!,
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'text/plain'
			},
			body: `search "${query}";
                  fields name,summary,cover.*;
                  limit 10;`
		});

		const games = await igdbResponse.json();
		return NextResponse.json(games);
	} catch (error) {
		console.error('Error searching games:', error);
		return NextResponse.json({ error: 'Failed to search games' }, { status: 500 });
	}
}
