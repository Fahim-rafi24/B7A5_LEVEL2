import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building, Home as HomeIcon, Box, Castle, KeyRound } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';
import { API_BASE_URL } from '@/lib/api';
import type { Category, Property } from '@/types';

export const dynamic = 'force-dynamic';

const FALLBACK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Luxury Downtown Apartment',
    description: 'A beautiful 3-bedroom apartment in the heart of the city.',
    location: 'Gulshan, Dhaka',
    price: 25000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    amenities: ['Wi-Fi', 'Parking', 'Gym'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80'],
    status: 'available',
    category: { id: '1', name: 'Apartment' },
  },
  {
    id: '2',
    title: 'Cozy Studio in Banani',
    description: 'Compact and cozy studio apartment, perfect for singles.',
    location: 'Banani, Dhaka',
    price: 18000,
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    amenities: ['Wi-Fi', 'Pet Friendly', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=80'],
    status: 'available',
    category: { id: '2', name: 'Studio' },
  },
  {
    id: '3',
    title: 'Modern 2BR Duplex in Dhanmondi',
    description: 'Bright two-bedroom duplex with modern finishes.',
    location: 'Dhanmondi, Dhaka',
    price: 32000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    amenities: ['Wi-Fi', 'Parking', 'Gym', 'Generator'],
    images: ['https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=900&q=80'],
    status: 'available',
    category: { id: '3', name: 'House' },
  },
  {
    id: '4',
    title: 'Penthouse with Panoramic View',
    description: 'Top-floor penthouse with breathtaking skyline views.',
    location: 'Uttara, Dhaka',
    price: 48000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    amenities: ['Wi-Fi', 'Parking', 'Rooftop Pool', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80'],
    status: 'available',
    category: { id: '1', name: 'Apartment' },
  },
  {
    id: '5',
    title: 'Riverside 1BR Loft',
    description: 'Charming loft near the river with industrial vibes.',
    location: 'Mirpur, Dhaka',
    price: 15000,
    bedrooms: 1,
    bathrooms: 1,
    area: 750,
    amenities: ['Wi-Fi', 'Air Conditioning'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80'],
    status: 'available',
    category: { id: '2', name: 'Studio' },
  },
  {
    id: '6',
    title: 'Spacious 3BR Family Residence',
    description: 'Large family home with a private garden.',
    location: 'Bashundhara R/A, Dhaka',
    price: 35000,
    bedrooms: 3,
    bathrooms: 3,
    area: 1800,
    amenities: ['Wi-Fi', 'Parking', 'Garden', 'Playground'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80'],
    status: 'available',
    category: { id: '3', name: 'House' },
  },
];

const FALLBACK_CATEGORIES: Category[] = [
  { id: '1', name: 'Apartment', _count: { properties: 12 } },
  { id: '2', name: 'Studio', _count: { properties: 8 } },
  { id: '3', name: 'House', _count: { properties: 6 } },
  { id: '4', name: 'Villa', _count: { properties: 4 } },
];

const CATEGORY_ICONS = [HomeIcon, Building, KeyRound, Castle, Box];

async function fetchHomeData() {
  let properties: Property[] = FALLBACK_PROPERTIES;
  let categories: Category[] = FALLBACK_CATEGORIES;
  let live = false;
  try {
    const [propsRes, catRes] = await Promise.all([
      fetch(`${API_BASE_URL}/properties?limit=6`, { cache: 'no-store' }),
      fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' }),
    ]);
    if (propsRes.ok && catRes.ok) {
      const propsData = await propsRes.json();
      const catData = await catRes.json();
      if (propsData?.success && propsData?.data?.properties?.length) {
        properties = propsData.data.properties;
        live = true;
      }
      if (catData?.success && Array.isArray(catData.data) && catData.data.length) {
        categories = catData.data;
      }
    }
  } catch {
    // Backend unreachable — render curated fallback content
  }
  return { properties, categories, live };
}

export default async function HomePage() {
  const { properties, categories, live } = await fetchHomeData();

  return (
    <div>
      <section className="hero-gradient text-white py-20 md:py-28 relative">
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {live ? 'Connected to live backend' : 'Find your next home'}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-5">
              Discover <br />
              <span className="text-gradient">your perfect</span> rental
            </h1>

            <p className="text-white/70 text-lg max-w-lg mb-8">
              Browse thousands of rental properties. List your space. All in one place.
            </p>

            <SearchBar />

            <div className="flex gap-8 mt-10">
              <div>
                <span className="text-2xl font-bold">12k+</span>{' '}
                <span className="text-white/60 text-sm ml-1">Properties</span>
              </div>
              <div>
                <span className="text-2xl font-bold">4.8k</span>{' '}
                <span className="text-white/60 text-sm ml-1">Happy tenants</span>
              </div>
              <div>
                <span className="text-2xl font-bold">98%</span>{' '}
                <span className="text-white/60 text-sm ml-1">Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-custom py-16">
        <div className="flex items-center justify-between mb-8 mt-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Featured <span className="text-gradient">Properties</span>
            </h2>
            <p className="text-slate-500 text-sm mt-1">Handpicked rentals just for you</p>
          </div>
          <Link href="/properties" className="text-blue-600 font-semibold text-sm hover:underline">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200 py-16">
        <div className="container-custom">
          <h2 className="text-2xl font-extrabold text-center mb-2">
            Browse by <span className="text-gradient">Category</span>
          </h2>
          <p className="text-center text-slate-500 text-sm mb-10">Find exactly what you&apos;re looking for</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, idx) => {
              const Icon = CATEGORY_ICONS[idx % CATEGORY_ICONS.length];
              return (
                <Link
                  key={cat.id}
                  href={`/properties?categoryId=${cat.id}`}
                  className="card p-6 text-center hover:border-blue-600 cursor-pointer block group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="font-semibold text-slate-900">{cat.name}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {cat._count?.properties ?? 0} listing{cat._count?.properties === 1 ? '' : 's'}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-custom py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 md:p-14 text-white text-center relative overflow-hidden shadow-xl mb-10">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3">Ready to find your dream home?</h2>
            <p className="text-white/80 max-w-lg mx-auto mb-6">
              Join thousands of happy tenants and landlords on RentNest.
            </p>
            <Link
              href="/properties"
              className="bg-white text-blue-600 font-semibold px-8 py-3.5 rounded-full hover:shadow-xl transition hover:scale-105 inline-flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
