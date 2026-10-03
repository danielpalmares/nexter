import { NextResponse } from 'next/server';
import { readTenants, writeTenants, scaffoldTenant } from '@/lib/fs-data';
import type { Tenant } from '@/lib/types';

export async function GET() {
  return NextResponse.json(readTenants());
}

export async function POST(request: Request) {
  const body = await request.json() as Partial<Tenant>;
  const tenants = readTenants();

  if (tenants.find((t) => t.slug === body.slug)) {
    return NextResponse.json({ error: 'Slug já em uso' }, { status: 400 });
  }

  const tenant: Tenant = {
    id: body.slug ?? Date.now().toString(),
    name: body.name ?? '',
    slug: body.slug ?? '',
    email: body.email ?? '',
    plan: body.plan ?? 'free',
    active: true,
    createdAt: new Date().toISOString(),
  };

  tenants.push(tenant);
  writeTenants(tenants);
  scaffoldTenant(tenant.id);

  return NextResponse.json(tenant, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json() as Tenant;
  const tenants = readTenants();
  const idx = tenants.findIndex((t) => t.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  tenants[idx] = { ...tenants[idx], ...body };
  writeTenants(tenants);
  return NextResponse.json(tenants[idx]);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (id === 'default') {
    return NextResponse.json({ error: 'Não é possível remover o tenant padrão' }, { status: 400 });
  }
  writeTenants(readTenants().filter((t) => t.id !== id));
  return NextResponse.json({ ok: true });
}
