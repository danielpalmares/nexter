import { NextResponse } from 'next/server';
import { readProperties, writeProperties } from '@/lib/fs-data';
import type { Property } from '@/lib/types';

export async function GET() {
  return NextResponse.json(readProperties());
}

export async function POST(request: Request) {
  const body = await request.json() as Partial<Property>;
  const properties = readProperties();

  const slug = (body.title ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const newProperty: Property = {
    id: Date.now().toString(),
    slug,
    title: body.title ?? '',
    location: body.location ?? '',
    rooms: Number(body.rooms) || 0,
    area: Number(body.area) || 0,
    price: Number(body.price) || 0,
    photos: body.photos ?? [],
    description: body.description ?? '',
    featured: body.featured ?? false,
    createdAt: new Date().toISOString(),
  };

  properties.push(newProperty);
  writeProperties(properties);
  return NextResponse.json(newProperty, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json() as Property;
  const properties = readProperties();
  const idx = properties.findIndex((p) => p.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  properties[idx] = { ...properties[idx], ...body };
  writeProperties(properties);
  return NextResponse.json(properties[idx]);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const properties = readProperties().filter((p) => p.id !== id);
  writeProperties(properties);
  return NextResponse.json({ ok: true });
}
