import { NextResponse } from 'next/server';
import { generatePropertyDescription } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const { title, location, rooms, area } = await request.json();
    const description = await generatePropertyDescription(title, location, rooms, area);
    return NextResponse.json({ description });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
