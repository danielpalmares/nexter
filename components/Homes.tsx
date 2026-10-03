import Link from 'next/link';
import type { Property } from '@/lib/types';
import { formatPrice } from '@/lib/data';

interface HomesProps {
  properties: Property[];
}

export default function Homes({ properties }: HomesProps) {
  return (
    <section className="homes">
      {properties.map((property, i) => (
        <div key={property.id} className={`home animate fade-up delay-${i + 1}`}>
          <img
            src={property.photos[0]}
            alt={property.title}
            className="home__img"
          />

          <svg className="home__like">
            <use href="/img/sprite.svg#icon-heart-full" />
          </svg>

          <h5 className="home__name">{property.title}</h5>

          <div className="home__location">
            <svg>
              <use href="/img/sprite.svg#icon-map-pin" />
            </svg>
            <p>{property.location}</p>
          </div>

          <div className="home__rooms">
            <svg>
              <use href="/img/sprite.svg#icon-profile-male" />
            </svg>
            <p>{property.rooms} rooms</p>
          </div>

          <div className="home__area">
            <svg>
              <use href="/img/sprite.svg#icon-expand" />
            </svg>
            <p>
              {property.area} m<sup>2</sup>
            </p>
          </div>

          <div className="home__price">
            <svg>
              <use href="/img/sprite.svg#icon-key" />
            </svg>
            <p>{formatPrice(property.price)}</p>
          </div>

          <Link href={`/imoveis/${property.slug}`} className="btn home__btn">
            Contact realtor
          </Link>
        </div>
      ))}
    </section>
  );
}
