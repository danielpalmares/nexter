import type { GalleryImage } from '@/lib/types';

interface GalleryProps {
  images: GalleryImage[];
}

export default function Gallery({ images }: GalleryProps) {
  return (
    <section className="gallery">
      {images.map((image, index) => (
        <figure key={image.src} className={`gallery__item gallery__item--${index + 1} animate fade-in delay-${(index % 10) + 1}`}>
          <img src={image.src} alt={image.alt} className="gallery__img" />
        </figure>
      ))}
    </section>
  );
}
