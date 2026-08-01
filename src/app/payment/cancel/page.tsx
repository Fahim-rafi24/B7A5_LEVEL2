'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, RefreshCw } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="container-custom py-20 max-w-md mx-auto text-center">
      <div className="card p-10 shadow-2xl space-y-4">
        <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <XCircle className="w-12 h-12" />
        </div>

        <h1 className="text-3xl font-extrabold text-rose-600">Payment Canceled</h1>

        <p className="text-slate-600 text-sm leading-relaxed">
          Your payment transaction was not completed. No charges were made. You can try again at any
          time from your Tenant Dashboard.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/tenant" className="btn-primary justify-center text-sm">
            <RefreshCw className="w-4 h-4" /> Try Again
          </Link>
          <Link href="/" className="btn-secondary justify-center text-sm">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
