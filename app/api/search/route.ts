import { NextResponse } from 'next/server';
import { extractSearchFilters } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query?.trim()) {
      return NextResponse.json({ filters: {} });
    }

    const filters = await extractSearchFilters(query);
    return NextResponse.json({ filters });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
