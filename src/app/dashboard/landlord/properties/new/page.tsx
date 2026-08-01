'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import PropertyForm from '@/components/PropertyForm';

export default function NewPropertyPage() {
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
                    <PlusCircle className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Add New Property</h1>
                    <p className="text-sm text-slate-500">Fill in the details to list your property on RentNest.</p>
                </div>
            </div>

            <PropertyForm />
        </div>
    );
}
