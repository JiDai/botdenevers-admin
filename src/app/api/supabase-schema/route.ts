import { NextResponse } from 'next/server';

export async function GET() {
    const instanceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const response = await fetch(`${instanceUrl}/rest/v1/`, {
        headers: {
            apiKey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
        },
    });

    if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch schema' }, { status: response.status });
    }

    const schema = await response.json();
    return NextResponse.json(schema);
}
