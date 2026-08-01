'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, PartyPopper } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="container-custom py-20 max-w-md mx-auto text-center">
      <div className="card p-10 shadow-2xl space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
          <PartyPopper className="w-3.5 h-3.5" /> Payment confirmed
        </div>

        <h1 className="text-3xl font-extrabold text-emerald-600">Payment Successful!</h1>

        <p className="text-slate-600 text-sm leading-relaxed">
          Your rental reservation has been confirmed and activated. You can now view your active
          rental details in your Tenant Dashboard and leave a review after your stay.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/tenant" className="btn-primary justify-center text-sm">
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/properties" className="btn-secondary justify-center text-sm">
            Browse Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
