'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Maximize } from 'lucide-react';
import type { Property } from '@/types';
import { formatCurrency, resolveImageUrl } from '@/lib/utils';

export const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.images?.length
    ? resolveImageUrl(property.images[0])
    : DEFAULT_IMAGE;

  return (
    <Link
      href={`/properties/${property.id}`}
      className="card group cursor-pointer block"
      aria-label={property.title}
    >
      <div className="relative h-48 overflow-hidden bg-slate-200">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
          {formatCurrency(property.price)}/mo
        </span>
        {property.category?.name && (
          <span className="absolute top-3 left-3 bg-blue-600/90 text-white px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-sm">
            {property.category.name}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-1 group-hover:text-blue-600 transition">
          {property.title}
        </h3>
        <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{property.location}</span>
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-600 py-2 border-y border-slate-100 mb-3">
          <span className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-blue-500" /> {property.bedrooms || 1} Beds
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 text-blue-500" /> {property.bathrooms || 1} Baths
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="w-3.5 h-3.5 text-blue-500" /> {property.area || 850} sqft
          </span>
        </div>

        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {property.amenities.slice(0, 3).map((amt, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200"
              >
                {amt}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-[11px] text-slate-400 py-0.5">
                +{property.amenities.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
