'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRentals, usePayments } from '@/hooks/queries';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import ReviewModal from '@/components/ReviewModal';
import { TableSkeleton, StatCardSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import {
    CreditCard,
    Star,
    Clock,
    CheckCircle2,
    Wallet,
    KeyRound,
    Calendar,
    FileText,
} from 'lucide-react';
import type { RentalRequest } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function TenantDashboard() {
    const { user } = useAuth();
    const { data: rentals = [], isLoading: rentalsLoading } = useRentals();
    const { data: payments = [], isLoading: paymentsLoading } = usePayments();

    const [reviewTarget, setReviewTarget] = useState<RentalRequest | null>(null);

    const activeCount = rentals.filter((r) => r.status === 'active').length;
    const pendingCount = rentals.filter((r) => r.status === 'pending').length;
    const approvedCount = rentals.filter((r) => r.status === 'approved').length;
    const totalSpent = payments
        .filter((p) => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);

    return (
        <div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Tenant Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Welcome back{user?.name ? `, ${user.name}` : ''}! Manage your rental requests and payments.
                    </p>
                </div>
                <Link href="/properties" className="btn-primary text-xs px-5 py-2.5">
                    Browse More Properties
                </Link>
            </div>

            {rentalsLoading ? (
                <StatCardSkeleton count={4} />
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard label="Active Rentals" value={activeCount} icon={KeyRound} accent="green" />
                    <StatCard label="Pending Requests" value={pendingCount} icon={Clock} accent="amber" />
                    <StatCard label="Ready to Pay" value={approvedCount} icon={CheckCircle2} accent="blue" />
                    <StatCard label="Total Spent" value={formatCurrency(totalSpent)} icon={Wallet} accent="slate" />
                </div>
            )}

            <div className="card p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" /> Rental Requests History
                    </h2>
                    <span className="text-xs text-slate-400">{rentals.length} total</span>
                </div>

                {rentalsLoading ? (
                    <TableSkeleton rows={4} />
                ) : rentals.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title="No rental requests yet"
                        description="Browse properties and submit your first rental request to get started."
                        action={
                            <Link href="/properties" className="btn-primary text-xs">
                                Browse Properties
                            </Link>
                        }
                    />
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Property</th>
                                    <th>Location</th>
                                    <th>Move-in Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rentals.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <Link
                                                href={`/properties/${item.propertyId}`}
                                                className="font-bold text-slate-900 hover:text-blue-600 transition block"
                                            >
                                                {item.property?.title || 'Property'}
                                            </Link>
                                        </td>
                                        <td>
                                            <div className="text-xs text-slate-600">{item.property?.location}</div>
                                            <div className="text-xs font-semibold text-blue-600">
                                                {formatCurrency(item.property?.price ?? 0)}/mo
                                            </div>
                                        </td>
                                        <td className="text-xs text-slate-600">
                                            {item.moveInDate ? formatDate(item.moveInDate) : '—'}
                                        </td>
                                        <td>
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td>
                                            {item.status === 'approved' ? (
                                                <Link
                                                    href={`/payment/init/${item.id}`}
                                                    className="btn-success text-xs px-3.5 py-1.5 shadow-sm"
                                                >
                                                    <CreditCard className="w-3.5 h-3.5" /> Pay Now
                                                </Link>
                                            ) : item.status === 'active' ? (
                                                <button
                                                    onClick={() => setReviewTarget(item)}
                                                    className="btn-secondary text-xs px-3.5 py-1.5"
                                                >
                                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Leave Review
                                                </button>
                                            ) : item.status === 'pending' ? (
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" /> Waiting for landlord
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-600" /> Payment History
                    </h2>
                    <span className="text-xs text-slate-400">{payments.length} transactions</span>
                </div>

                {paymentsLoading ? (
                    <TableSkeleton rows={3} />
                ) : payments.length === 0 ? (
                    <EmptyState
                        icon={CreditCard}
                        title="No payments yet"
                        description="Once your rental request is approved, you can complete the payment securely."
                    />
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Property</th>
                                    <th>Amount</th>
                                    <th>Provider</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((pay) => (
                                    <tr key={pay.id}>
                                        <td className="font-semibold text-slate-800">
                                            {pay.rentalRequest?.property?.title || 'Rental Payment'}
                                        </td>
                                        <td className="font-bold text-blue-600">{formatCurrency(pay.amount)}</td>
                                        <td className="uppercase text-xs font-semibold text-slate-500">{pay.provider}</td>
                                        <td className="text-xs text-slate-500 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {formatDate(pay.createdAt)}
                                        </td>
                                        <td>
                                            <StatusBadge status={pay.status === 'completed' ? 'active' : pay.status} tone={pay.status === 'completed' ? 'active' : 'approved'} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ReviewModal
                isOpen={Boolean(reviewTarget)}
                onClose={() => setReviewTarget(null)}
                propertyId={reviewTarget?.propertyId}
                propertyTitle={reviewTarget?.property?.title}
            />
        </div>
    );
}
