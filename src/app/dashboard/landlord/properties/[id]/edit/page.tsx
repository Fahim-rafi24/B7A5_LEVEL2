'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Pencil } from 'lucide-react';
import PropertyForm from '@/components/PropertyForm';
import { useProperty } from '@/hooks/queries';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';

export default function EditPropertyPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: property, isLoading, isError } = useProperty(id);

    if (isLoading) {
        return (
            <div>
                <div className="mb-6">
                    <div className="skeleton h-4 w-32 mb-3" />
                    <div className="skeleton h-8 w-64" />
                </div>
                <DetailSkeleton />
            </div>
        );
    }

    if (isError || !property) {
        return (
            <EmptyState
                icon={Pencil}
                title="Property not found"
                description="This property may have been removed."
                action={
                    <Link href="/dashboard/landlord" className="btn-primary text-sm">
                        Back to Dashboard
                    </Link>
                }
            />
        );
    }

    return (
        <div>
            <Link
                href="/dashboard/landlord"
                className="text-slate-500 hover:text-slate-900 transition mb-6 inline-flex items-center gap-2 text-sm font-medium"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>

            <div className="mb-6 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Pencil className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Edit Property</h1>
                    <p className="text-sm text-slate-500">Update the details for &quot;{property.title}&quot;.</p>
                </div>
            </div>

            <PropertyForm property={property} />
        </div>
    );
}
