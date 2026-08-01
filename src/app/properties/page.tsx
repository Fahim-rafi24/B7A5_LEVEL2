'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, RotateCcw, Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { PropertyGridSkeleton } from '@/components/LoadingSkeleton';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import { useCategories, useProperties } from '@/hooks/queries';
import type { Property } from '@/types';

const AMENITIES = ['Wi-Fi', 'Parking', 'Pool', 'Gym', 'Pet Friendly', 'Air Conditioning'];

const MIN_PRICE = 0;
const MAX_PRICE = 6000;

function PropertiesContent() {
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [location, setLocation] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('newest');
    const [page, setPage] = useState(1);
    const [draftFilters, setDraftFilters] = useState({ search, minPrice, maxPrice, location, categoryId });
    const [appliedAmenities, setAppliedAmenities] = useState<string[]>([]);

    const { data: categories } = useCategories();

    const filters = useMemo(
        () => ({
            page,
            limit: 9,
            search: draftFilters.search || undefined,
            location: draftFilters.location || undefined,
            minPrice: draftFilters.minPrice ? Number(draftFilters.minPrice) : undefined,
            maxPrice: draftFilters.maxPrice ? Number(draftFilters.maxPrice) : undefined,
            categoryId: draftFilters.categoryId || undefined,
        }),
        [page, draftFilters]
    );

    const { data, isLoading, isError } = useProperties(filters);

    useEffect(() => {
        setSearch(searchParams.get('search') || '');
        setCategoryId(searchParams.get('categoryId') || '');
        setDraftFilters({
            search: searchParams.get('search') || '',
            categoryId: searchParams.get('categoryId') || '',
            minPrice: '',
            maxPrice: '',
            location: '',
        });
        setPage(1);
    }, [searchParams]);

    const toggleAmenity = (amt: string) => {
        setSelectedAmenities((prev) =>
            prev.includes(amt) ? prev.filter((a) => a !== amt) : [...prev, amt]
        );
    };

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        setDraftFilters({ search, minPrice, maxPrice, location, categoryId });
        setAppliedAmenities(selectedAmenities);
        setPage(1);
    };

    const handleReset = () => {
        setSearch('');
        setLocation('');
        setMinPrice('');
        setMaxPrice('');
        setCategoryId('');
        setSelectedAmenities([]);
        setAppliedAmenities([]);
        setDraftFilters({ search: '', minPrice: '', maxPrice: '', location: '', categoryId: '' });
        setPage(1);
    };

    const sortProperties = (items: Property[]) => {
        const sorted = [...items];
        if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
        else sorted.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        return sorted;
    };

    const rawList = data?.properties ?? [];
    let list = sortProperties(rawList);
    if (appliedAmenities.length > 0) {
        list = list.filter((p) =>
            appliedAmenities.every((amt) => p.amenities?.some((a) => a.toLowerCase() === amt.toLowerCase()))
        );
    }
    const total = data?.total ?? list.length;
    const totalPages = Math.max(1, Math.ceil(total / 9));

    return (
        <div className="container-custom py-8 md:py-12">
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-72 flex-shrink-0">
                    <div className="card p-6 sticky top-24">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Filter className="w-4 h-4 text-blue-600" /> Filters
                            </h3>
                            <button
                                onClick={handleReset}
                                className="text-xs text-slate-400 hover:text-blue-600 transition flex items-center gap-1"
                            >
                                <RotateCcw className="w-3 h-3" /> Reset
                            </button>
                        </div>

                        <form onSubmit={handleApply} className="space-y-4">
                            <div>
                                <label className="form-label">Search Keyword</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Title or keywords..."
                                        className="form-input text-sm pl-9"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    placeholder="City, area, or ZIP..."
                                    className="form-input text-sm"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="form-label">Price Range (USD/month)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        min={MIN_PRICE}
                                        max={MAX_PRICE}
                                        placeholder="Min"
                                        className="form-input text-sm"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        min={MIN_PRICE}
                                        max={MAX_PRICE}
                                        placeholder="Max"
                                        className="form-input text-sm"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Property Type</label>
                                <select
                                    className="form-input text-sm"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                >
                                    <option value="">All Types</option>
                                    {categories?.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Amenities</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {AMENITIES.map((amt) => {
                                        const isSelected = selectedAmenities.includes(amt);
                                        return (
                                            <button
                                                type="button"
                                                key={amt}
                                                onClick={() => toggleAmenity(amt)}
                                                className={`filter-chip text-xs ${isSelected ? 'active' : ''}`}
                                            >
                                                {amt}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button type="submit" className="btn-primary w-full justify-center text-sm mt-2">
                                <SlidersHorizontal className="w-4 h-4" /> Apply Filters
                            </button>
                        </form>
                    </div>
                </aside>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">All Properties</h1>
                            <p className="text-xs text-slate-500 mt-1">
                                Showing {list.length} of {total} results
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-medium">Sort by:</span>
                            <select
                                className="form-input w-auto text-xs py-2 px-3"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest</option>
                                <option value="price-asc">Price: Low → High</option>
                                <option value="price-desc">Price: High → Low</option>
                            </select>
                        </div>
                    </div>

                    {isLoading ? (
                        <PropertyGridSkeleton count={6} />
                    ) : isError ? (
                        <EmptyState
                            icon={SearchIcon}
                            title="Could not load properties"
                            description="We had trouble reaching the server. Please try again."
                        />
                    ) : list.length === 0 ? (
                        <EmptyState
                            icon={SearchIcon}
                            title="No properties found"
                            description="Try adjusting your search criteria or resetting filters."
                            action={
                                <button onClick={handleReset} className="btn-secondary text-xs">
                                    Reset Filters
                                </button>
                            }
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {list.map((prop) => (
                                <PropertyCard key={prop.id} property={prop} />
                            ))}
                        </div>
                    )}

                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
            </div>
        </div>
    );
}

export default function PropertiesPage() {
    return (
        <Suspense
            fallback={
                <div className="container-custom py-12">
                    <PropertyGridSkeleton count={6} />
                </div>
            }
        >
            <PropertiesContent />
        </Suspense>
    );
}
