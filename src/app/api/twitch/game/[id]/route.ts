import { NextRequest, NextResponse } from 'next/server';
import { getTwitchAccessToken } from '@/lib/getTwitchAccessToken';
import { TwitchCall } from '@/lib/TwitchAPIClient';

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await context.params;

		const igdbResponse = await TwitchCall('games', { id }, await getTwitchAccessToken());

		return NextResponse.json(igdbResponse.data[0]);
	} catch (error) {
		console.error('Error searching games:', error);
		return NextResponse.json({ error: 'Failed to search games' }, { status: 500 });
	}
}
