import { NextResponse } from 'next/server';
import { readRealtors, writeRealtors } from '@/lib/fs-data';
import type { Realtor } from '@/lib/types';

export async function GET() {
  return NextResponse.json(readRealtors());
}

export async function POST(request: Request) {
  const body = await request.json() as Partial<Realtor>;
  const realtors = readRealtors();

  const newRealtor: Realtor = {
    id: Date.now().toString(),
    name: body.name ?? '',
    photo: body.photo ?? '/img/realtor-1.jpeg',
    salesCount: Number(body.salesCount) || 0,
  };

  realtors.push(newRealtor);
  writeRealtors(realtors);
  return NextResponse.json(newRealtor, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json() as Realtor;
  const realtors = readRealtors();
  const idx = realtors.findIndex((r) => r.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  realtors[idx] = { ...realtors[idx], ...body };
  writeRealtors(realtors);
  return NextResponse.json(realtors[idx]);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const realtors = readRealtors().filter((r) => r.id !== id);
  writeRealtors(realtors);
  return NextResponse.json({ ok: true });
}
