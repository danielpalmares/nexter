import { NextResponse } from 'next/server';
import { readSiteConfig, writeSiteConfig } from '@/lib/fs-data';
import type { SiteConfig } from '@/lib/types';

export async function GET() {
  return NextResponse.json(readSiteConfig());
}

export async function PUT(request: Request) {
  const body = await request.json() as Partial<SiteConfig>;
  const current = readSiteConfig();
  const updated: SiteConfig = { ...current, ...body };
  writeSiteConfig(updated);
  return NextResponse.json(updated);
}
