import fs from 'fs';
import path from 'path';
import type { Property, Realtor, Lead, SiteConfig, Testimonial, Tenant } from './types';

const rootDataDir = path.join(process.cwd(), 'data');

function getDataDir(tenantId?: string): string {
  if (tenantId && tenantId !== 'default') {
    return path.join(rootDataDir, 'tenants', tenantId);
  }
  return rootDataDir;
}

function readJSON<T>(filename: string, tenantId?: string): T {
  const dir = getDataDir(tenantId);
  const content = fs.readFileSync(path.join(dir, filename), 'utf-8');
  return JSON.parse(content) as T;
}

function writeJSON<T>(filename: string, data: T, tenantId?: string): void {
  const dir = getDataDir(tenantId);
  fs.writeFileSync(path.join(dir, filename), JSON.stringify(data, null, 2), 'utf-8');
}

export function readProperties(): Property[] {
  return readJSON<Property[]>('imoveis.json');
}

export function writeProperties(properties: Property[]): void {
  writeJSON('imoveis.json', properties);
}

export function readRealtors(): Realtor[] {
  return readJSON<Realtor[]>('realtors.json');
}

export function writeRealtors(realtors: Realtor[]): void {
  writeJSON('realtors.json', realtors);
}

export function readLeads(): Lead[] {
  return readJSON<Lead[]>('leads.json');
}

export function writeLeads(leads: Lead[]): void {
  writeJSON('leads.json', leads);
}

export function readSiteConfig(): SiteConfig {
  return readJSON<SiteConfig>('site.json');
}

export function writeSiteConfig(config: SiteConfig): void {
  writeJSON('site.json', config);
}

export function readTestimonials(tenantId?: string): Testimonial[] {
  return readJSON<Testimonial[]>('depoimentos.json', tenantId);
}

export function writeTestimonials(testimonials: Testimonial[], tenantId?: string): void {
  writeJSON('depoimentos.json', testimonials, tenantId);
}

// Tenants (global, not per-tenant)
export function readTenants(): Tenant[] {
  const file = path.join(rootDataDir, 'tenants.json');
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as Tenant[];
}

export function writeTenants(tenants: Tenant[]): void {
  fs.writeFileSync(path.join(rootDataDir, 'tenants.json'), JSON.stringify(tenants, null, 2), 'utf-8');
}

export function scaffoldTenant(tenantId: string): void {
  const tenantDir = path.join(rootDataDir, 'tenants', tenantId);
  fs.mkdirSync(tenantDir, { recursive: true });

  const defaults: Record<string, unknown> = {
    'site.json': JSON.parse(fs.readFileSync(path.join(rootDataDir, 'site.json'), 'utf-8')),
    'imoveis.json': [],
    'realtors.json': [],
    'leads.json': [],
    'depoimentos.json': JSON.parse(fs.readFileSync(path.join(rootDataDir, 'depoimentos.json'), 'utf-8')),
  };

  for (const [file, content] of Object.entries(defaults)) {
    const dest = path.join(tenantDir, file);
    if (!fs.existsSync(dest)) {
      fs.writeFileSync(dest, JSON.stringify(content, null, 2), 'utf-8');
    }
  }
}
