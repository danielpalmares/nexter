import {
  getSiteConfig,
  getRealtors,
  getFeaturedProperties,
  getTestimonials,
} from '@/lib/data';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Realtors from '@/components/Realtors';
import Features from '@/components/Features';
import Story from '@/components/Story';
import Homes from '@/components/Homes';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';

export default function Home() {
  const siteConfig = getSiteConfig();
  const realtors = getRealtors();
  const properties = getFeaturedProperties();
  const testimonials = getTestimonials();
  const testimonial = testimonials[0];

  return (
    <div className="container">
      <Sidebar />
      <Header siteConfig={siteConfig} />
      <Realtors realtors={realtors} />
      <Features />
      <Story testimonial={testimonial} />
      <Homes properties={properties} />
      <Gallery images={siteConfig.galleryImages} />
      <Footer siteConfig={siteConfig} />
    </div>
  );
}
