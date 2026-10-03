'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Property } from '@/lib/types';
import type { SearchFilters } from '@/lib/ai';
import { formatPrice } from '@/lib/data';

interface ListingClientProps {
  properties: Property[];
}

function filterProperties(properties: Property[], filters: SearchFilters): Property[] {
  return properties.filter((p) => {
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      if (!p.location.toLowerCase().includes(loc)) return false;
    }
    if (filters.minRooms && p.rooms < filters.minRooms) return false;
    if (filters.maxRooms && p.rooms > filters.maxRooms) return false;
    if (filters.minPrice && p.price < filters.minPrice) return false;
    if (filters.maxPrice && p.price > filters.maxPrice) return false;
    if (filters.minArea && p.area < filters.minArea) return false;
    if (filters.maxArea && p.area > filters.maxArea) return false;
    return true;
  });
}

function filtersToLabel(filters: SearchFilters): string {
  const parts: string[] = [];
  if (filters.location) parts.push(`em ${filters.location}`);
  if (filters.minRooms) parts.push(`mín. ${filters.minRooms} quartos`);
  if (filters.maxRooms) parts.push(`máx. ${filters.maxRooms} quartos`);
  if (filters.minPrice) parts.push(`a partir de ${formatPrice(filters.minPrice)}`);
  if (filters.maxPrice) parts.push(`até ${formatPrice(filters.maxPrice)}`);
  if (filters.minArea) parts.push(`mín. ${filters.minArea}m²`);
  return parts.length ? parts.join(' · ') : '';
}

export default function ListingClient({ properties }: ListingClientProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [filterLabel, setFilterLabel] = useState('');
  const [error, setError] = useState('');

  const filtered = Object.keys(filters).length
    ? filterProperties(properties, filters)
    : properties;

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setFilters(data.filters ?? {});
        setFilterLabel(filtersToLabel(data.filters ?? {}));
      }
    } catch {
      setError('Erro ao processar busca. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setFilters({});
    setFilterLabel('');
    setQuery('');
    setError('');
  }

  return (
    <>
      <div className="ai-search">
        <label className="ai-search__label">Busca inteligente com IA</label>
        <form className="ai-search__form" onSubmit={handleSearch}>
          <input
            className="ai-search__input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Ex: "quero uma casa com 4 quartos em Portugal até 2 milhões"'
          />
          <button
            type="submit"
            className="ai-search__btn"
            disabled={loading || !query.trim()}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {error && <p className="ai-search__result">{error}</p>}
        {filterLabel && !error && (
          <p className="ai-search__result">
            Filtros: {filterLabel}
            <button className="ai-search__clear" onClick={clearFilters}>
              Limpar
            </button>
          </p>
        )}
      </div>

      <section className="listing">
        <div className="listing__header">
          <h2 className="heading-2 heading-2--dark">Imóveis</h2>
          <span className="listing__count">{filtered.length} encontrado(s)</span>
        </div>

        {filtered.length === 0 ? (
          <p className="listing__empty">Nenhum imóvel encontrado com esses filtros.</p>
        ) : (
          <div className="listing__grid">
            {filtered.map((property) => (
              <div key={property.id} className="home">
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
                  <svg><use href="/img/sprite.svg#icon-map-pin" /></svg>
                  <p>{property.location}</p>
                </div>
                <div className="home__rooms">
                  <svg><use href="/img/sprite.svg#icon-profile-male" /></svg>
                  <p>{property.rooms} rooms</p>
                </div>
                <div className="home__area">
                  <svg><use href="/img/sprite.svg#icon-expand" /></svg>
                  <p>{property.area} m<sup>2</sup></p>
                </div>
                <div className="home__price">
                  <svg><use href="/img/sprite.svg#icon-key" /></svg>
                  <p>{formatPrice(property.price)}</p>
                </div>
                <Link href={`/imoveis/${property.slug}`} className="btn home__btn">
                  Ver imóvel
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
