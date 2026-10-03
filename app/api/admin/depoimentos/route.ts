import { NextResponse } from 'next/server';
import { readTestimonials, writeTestimonials } from '@/lib/fs-data';
import type { Testimonial } from '@/lib/types';

export async function GET() {
  return NextResponse.json(readTestimonials());
}

export async function POST(request: Request) {
  const body = await request.json() as Partial<Testimonial>;
  const list = readTestimonials();
  const item: Testimonial = {
    id: Date.now().toString(),
    subtitle: body.subtitle ?? '',
    quote: body.quote ?? '',
    text: body.text ?? '',
    photo1: body.photo1 ?? '',
    photo2: body.photo2 ?? '',
  };
  list.push(item);
  writeTestimonials(list);
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json() as Testimonial;
  const list = readTestimonials();
  const idx = list.findIndex((t) => t.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  list[idx] = { ...list[idx], ...body };
  writeTestimonials(list);
  return NextResponse.json(list[idx]);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  writeTestimonials(readTestimonials().filter((t) => t.id !== id));
  return NextResponse.json({ ok: true });
}
