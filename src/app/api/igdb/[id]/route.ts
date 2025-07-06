import { NextResponse } from 'next/server';
import { getTwitchAccessToken } from '@/lib/getTwitchAccessToken';

function IGDBCall(body: BodyInit, accessToken: string) {
	return fetch('https://api.igdb.com/v4/games', {
		method: 'POST',
		headers: {
			'Client-ID': process.env.TWITCH_APP_CLIENT_ID!,
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'text/plain',
		},
		body,
	});
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await context.params;
		const igdbResponse = await IGDBCall(
			`where id = ${id};
                  fields name,summary,url,cover.*;
                  limit 1;`,
			await getTwitchAccessToken(),
		);

		const games = await igdbResponse.json();
		return NextResponse.json(games?.[0]);
	} catch (error) {
		console.error('Error searching games:', error);
		return NextResponse.json({ error: 'Failed to search games' }, { status: 500 });
	}
}
