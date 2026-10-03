export interface SeenOnLogo {
  src: string;
  alt: string;
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  twitter?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  logo: string;
  primaryColor: string;
  primaryColorDark: string;
  seenOnLogos: SeenOnLogo[];
  socialMedia: SocialMedia;
  galleryImages: GalleryImage[];
  footerLinks: { label: string; href: string }[];
  copyright: string;
}

export interface Realtor {
  id: string;
  name: string;
  photo: string;
  salesCount: number;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  rooms: number;
  area: number;
  price: number;
  photos: string[];
  description: string;
  featured: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  subtitle: string;
  quote: string;
  text: string;
  photo1: string;
  photo2: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyId?: string;
  createdAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  active: boolean;
  createdAt: string;
}
