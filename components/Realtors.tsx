import React from 'react';
import type { Realtor } from '@/lib/types';

interface RealtorsProps {
  realtors: Realtor[];
}

export default function Realtors({ realtors }: RealtorsProps) {
  return (
    <div className="realtors">
      <h3 className="heading-3">Top 3 Realtors</h3>
      <div className="realtors__list">
        {realtors.map((realtor) => (
          <React.Fragment key={realtor.id}>
            <img
              src={realtor.photo}
              alt={realtor.name}
              className="realtors__img"
            />
            <div className="realtors__details">
              <h4 className="heading-4 heading-4--light">{realtor.name}</h4>
              <p className="realtors__sold">{realtor.salesCount} houses sold</p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
