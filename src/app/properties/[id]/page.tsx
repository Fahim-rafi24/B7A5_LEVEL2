'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProperty } from '@/hooks/queries';
import {
    ArrowLeft,
    MapPin,
    Bed,
    Bath,
    Maximize,
    Star,
    ShieldCheck,
    Building2,
    Calendar,
    MessageSquare,
    KeyRound,
} from 'lucide-react';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import RequestRentModal from '@/components/RequestRentModal';
import { formatCurrency, formatDate, resolveImageUrl } from '@/lib/utils';
import { DEFAULT_IMAGE } from '@/components/PropertyCard';
import type { Review } from '@/types';

export default function PropertyDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { user } = useAuth();
    const { data: property, isLoading, isError } = useProperty(id);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="container-custom py-12">
                <DetailSkeleton />
            </div>
        );
    }

    if (isError || !property) {
        return (
            <div className="container-custom py-20 max-w-md mx-auto">
                <EmptyState
                    icon={Building2}
                    title="Property Not Found"
                    description="This property may have been removed or the link is incorrect."
                    action={
                        <Link href="/properties" className="btn-primary text-sm">
                            Back to Properties
                        </Link>
                    }
                />
            </div>
        );
    }

    const gallery =
        property.images && property.images.length > 0
            ? property.images.map(resolveImageUrl)
            : [DEFAULT_IMAGE];
    const currentImage = activeImage || gallery[0];

    const averageRating = property.reviews?.length
        ? (property.reviews.reduce((sum, r) => sum + r.rating, 0) / property.reviews.length).toFixed(1)
        : null;

    return (
        <div className="container-custom py-8 md:py-12">
            <Link
                href="/properties"
                className="text-slate-500 hover:text-slate-900 transition mb-6 inline-flex items-center gap-2 text-sm font-medium"
            >
                <ArrowLeft className="w-4 h-4" /> Back to properties
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card overflow-hidden">
                        <div className="relative h-80 md:h-96 bg-slate-200">
                            <Image src={currentImage} alt={property.title} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
                        </div>
                        {gallery.length > 1 && (
                            <div className="flex gap-3 p-4 overflow-x-auto bg-slate-50">
                                {gallery.map((imgUrl, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setActiveImage(imgUrl)}
                                        className={`relative w-20 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition cursor-pointer ${currentImage === imgUrl ? 'border-blue-600 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <Image src={imgUrl} alt={`${property.title} ${index + 1}`} fill sizes="80px" className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{property.title}</h1>
                                <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                                    <MapPin className="w-4 h-4 text-blue-600" /> {property.location}
                                </p>
                            </div>

                            <div className="text-right">
                                <div className="text-3xl font-extrabold text-blue-600">
                                    {formatCurrency(property.price)}
                                    <span className="text-sm font-normal text-slate-400">/mo</span>
                                </div>
                                {property.category && (
                                    <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1">
                                        {property.category.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div>
                                <div className="text-xs text-slate-400">Bedrooms</div>
                                <div className="text-lg font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                                    <Bed className="w-4 h-4 text-blue-600" /> {property.bedrooms || 1}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400">Bathrooms</div>
                                <div className="text-lg font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                                    <Bath className="w-4 h-4 text-blue-600" /> {property.bathrooms || 1}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400">Area</div>
                                <div className="text-lg font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                                    <Maximize className="w-4 h-4 text-blue-600" /> {property.area || 1000} sqft
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Description</h3>
                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                                {property.description}
                            </p>
                        </div>

                        {property.amenities && property.amenities.length > 0 && (
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 mb-3">Amenities & Features</h3>
                                <div className="flex flex-wrap gap-2">
                                    {property.amenities.map((amt, i) => (
                                        <span
                                            key={i}
                                            className="bg-slate-100 text-slate-700 font-medium text-xs px-3.5 py-1.5 rounded-full border border-slate-200"
                                        >
                                            {amt}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg text-slate-900">Reviews</h3>
                            {averageRating && (
                                <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {averageRating}
                                    <span className="text-slate-400 font-normal text-xs">
                                        ({property.reviews?.length})
                                    </span>
                                </span>
                            )}
                        </div>

                        {property.reviews && property.reviews.length > 0 ? (
                            <div className="space-y-4">
                                {property.reviews.map((review: Review) => (
                                    <div key={review.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm font-bold text-slate-800">
                                                {review.tenant?.name || 'Anonymous'}
                                            </span>
                                            <span className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                                                            }`}
                                                    />
                                                ))}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
                                        {review.comment && (
                                            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{review.comment}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">
                                No reviews yet. Be the first to share your experience after renting!
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card p-6 sticky top-24">
                        <h3 className="font-bold text-xl text-slate-900 mb-4">Request to Rent</h3>

                        <div className="flex items-center gap-3 mb-6 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                {property.landlord?.name ? property.landlord.name.charAt(0) : 'L'}
                            </div>
                            <div>
                                <div className="font-semibold text-sm text-slate-900">
                                    {property.landlord?.name || 'Verified Landlord'}
                                </div>
                                <div className="text-xs text-slate-400">Property Owner</div>
                            </div>
                        </div>

                        {property.status !== 'available' ? (
                            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 text-xs text-amber-700 flex items-start gap-2">
                                <Calendar className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>This property is currently rented. Check back later for availability.</span>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsRequestModalOpen(true)}
                                className="btn-primary w-full justify-center py-3 text-sm font-semibold"
                            >
                                <KeyRound className="w-4 h-4" /> {user ? 'Request to Rent' : 'Sign in to Request'}
                            </button>
                        )}

                        <div className="mt-4 p-3 bg-blue-50/80 rounded-2xl text-xs text-blue-800 flex items-start gap-2 border border-blue-100">
                            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                            <span>Your request is secure. The landlord will review your profile before approval.</span>
                        </div>
                    </div>

                    {!user && (
                        <div className="card p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">Tenant account required</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        <Link href="/auth/register" className="text-blue-600 hover:underline font-semibold">
                                            Create an account
                                        </Link>{' '}
                                        or{' '}
                                        <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
                                            sign in
                                        </Link>{' '}
                                        to submit rental requests and track payments.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <RequestRentModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                propertyId={property.id}
                propertyTitle={property.title}
            />
        </div>
    );
}
