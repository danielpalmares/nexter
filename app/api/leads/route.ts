import { NextResponse } from 'next/server';
import { readLeads, writeLeads } from '@/lib/fs-data';

export async function GET() {
  const leads = readLeads();
  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, propertyId } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      );
    }

    const leads = readLeads();
    const newLead = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || undefined,
      message,
      propertyId: propertyId || undefined,
      createdAt: new Date().toISOString(),
    };

    leads.unshift(newLead);
    writeLeads(leads);

    return NextResponse.json({ ok: true, id: newLead.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
