'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Lock, CreditCard, ShieldCheck, Loader2, AlertCircle, Building2 } from 'lucide-react';
import { useRentals } from '@/hooks/queries';
import { useCreatePayment, useConfirmPayment, useHandleMutationError } from '@/hooks/mutations';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import type { PaymentProvider } from '@/types';

const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

function PaymentInitContent() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.requestId as string;

  const { data: rentals = [], isLoading } = useRentals();
  const rental = rentals.find((r) => r.id === requestId);

  const [provider, setProvider] = useState<PaymentProvider>('stripe');
  const [loading, setLoading] = useState(false);

  const createPayment = useCreatePayment();
  const confirmPayment = useConfirmPayment();
  const handleError = useHandleMutationError();

  const handlePay = async () => {
    if (!rental) return;
    setLoading(true);
    try {
      const result = await createPayment.mutateAsync({ rentalRequestId: requestId, provider });
      if (!result.payment?.id) throw new Error('Unable to initialize payment.');

      await confirmPayment.mutateAsync({
        paymentId: result.payment.id,
        transactionId: `txn_${Date.now()}`,
      });
      toast.success('Payment successful! Your rental is now active.');
      router.push('/payment/success');
    } catch (error) {
      handleError(error, 'Processing payment');
      router.push('/payment/cancel');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-12 max-w-2xl mx-auto">
        <DetailSkeleton />
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="container-custom py-20 max-w-md mx-auto">
        <EmptyState
          icon={Building2}
          title="Rental request not found"
          description="This rental request may not exist or belongs to another account."
          action={
            <Link href="/dashboard/tenant" className="btn-primary text-sm">
              Back to Dashboard
            </Link>
          }
        />
      </div>
    );
  }

  const amount = rental.property?.price ?? 0;

  return (
    <div className="container-custom py-12 max-w-2xl mx-auto">
      <Link
        href="/dashboard/tenant"
        className="text-slate-500 hover:text-slate-900 transition mb-6 inline-flex items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Tenant Dashboard
      </Link>

      <div className="card p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <CreditCard className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Complete Secure Payment</h1>
          <p className="text-xs text-slate-500 mt-1">
            Rental request approved by landlord. Finalize your reservation.
          </p>
        </div>

        {!STRIPE_PUBLISHABLE_KEY && (
          <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Stripe publishable key is not configured — the backend&apos;s mock payment fallback will
              be used to simulate the checkout. Set <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> to
              enable the real Stripe hosted Checkout.
            </span>
          </div>
        )}

        <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100 space-y-3 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Property</span>
            <span className="font-semibold text-slate-900">{rental.property?.title}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Move-in Date</span>
            <span className="font-semibold text-slate-900">
              {rental.moveInDate ? formatDate(rental.moveInDate) : 'Flexible'}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Rental Duration</span>
            <span className="font-semibold text-slate-900">1 Month (30 Days)</span>
          </div>
          <div className="flex justify-between items-center text-slate-900 pt-2 border-t border-slate-200">
            <span className="font-bold">Total Payable Amount</span>
            <span className="text-2xl font-extrabold text-blue-600">{formatCurrency(amount)}</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="form-label mb-3">Select Payment Gateway</label>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setProvider('stripe')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition text-center ${
                provider === 'stripe'
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-2xl font-black text-blue-600 tracking-tighter">stripe</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Stripe Checkout</div>
            </div>

            <div
              onClick={() => setProvider('sslcommerz')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition text-center ${
                provider === 'sslcommerz'
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-7 h-7 text-slate-700 mx-auto">
                <CreditCard className="w-7 h-7" />
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-1">SSLCommerz</div>
            </div>
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={loading}
          className="btn-success w-full justify-center py-3.5 text-base font-bold shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Processing Payment...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" /> Pay {formatCurrency(amount)}
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> 256-Bit SSL Encryption · Test Sandbox Mode
        </p>
      </div>
    </div>
  );
}

export default function PaymentInitPage() {
  return (
    <Suspense>
      <PaymentInitContent />
    </Suspense>
  );
}
