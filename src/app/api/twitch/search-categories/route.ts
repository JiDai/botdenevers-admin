import { NextResponse } from 'next/server';
import { getTwitchAccessToken } from '@/lib/getTwitchAccessToken';
import { TwitchCall } from '@/lib/TwitchAPIClient';

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);

		const { data: categories } = await TwitchCall(
			'search/categories',
			{
				query: url.searchParams.get('query') || '',
			},
			await getTwitchAccessToken(),
		);

		return NextResponse.json(categories);
	} catch (error) {
		console.error('Error searching games:', error);
		return NextResponse.json({ error: 'Failed to search games' }, { status: 500 });
	}
}
