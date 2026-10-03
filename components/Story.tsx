import Link from 'next/link';
import type { Testimonial } from '@/lib/types';

interface StoryProps {
  testimonial: Testimonial;
}

export default function Story({ testimonial }: StoryProps) {
  return (
    <>
      <div className="story__pictures animate fade-left">
        <img
          src={testimonial.photo1}
          alt="Couple with new house"
          className="story__img--1"
        />
        <img
          src={testimonial.photo2}
          alt="New house"
          className="story__img--2"
        />
      </div>

      <div className="story__content animate fade-right">
        <h3 className="heading-3 mb-sm">{testimonial.subtitle}</h3>
        <h2 className="heading-2 heading-2--dark mb-md">
          &ldquo;{testimonial.quote}&rdquo;
        </h2>
        <p className="story__text">{testimonial.text}</p>
        <Link href="/imoveis" className="btn">
          Find your own home
        </Link>
      </div>
    </>
  );
}
