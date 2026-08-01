'use client';

import React from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, X, Inbox, Loader2 } from 'lucide-react';
import { useLandlordRequests } from '@/hooks/queries';
import { useUpdateRequestStatus, useHandleMutationError } from '@/hooks/mutations';
import { queryKeys } from '@/hooks/queries';
import StatusBadge from '@/components/StatusBadge';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import type { RentalRequest } from '@/types';
import { formatDate } from '@/lib/utils';

export default function LandlordRequestsPage() {
    const queryClient = useQueryClient();
    const { data: requests = [], isLoading } = useLandlordRequests();
    const updateStatus = useUpdateRequestStatus();
    const handleError = useHandleMutationError();

    const handleDecision = (request: RentalRequest, decision: 'approved' | 'rejected') => {
        if (request.status !== 'pending') return;

        const previous = queryClient.getQueryData<RentalRequest[]>(queryKeys.landlordRequests);
        queryClient.setQueryData<RentalRequest[]>(queryKeys.landlordRequests, (old) =>
            (old ?? []).map((r) => (r.id === request.id ? { ...r, status: decision } : r))
        );

        const successMsg =
            decision === 'approved'
                ? 'Request approved! The tenant can now proceed to payment.'
                : 'Request rejected. The tenant has been notified.';

        updateStatus.mutate(
            { id: request.id, status: decision, landlordNote: decision === 'approved' ? 'Welcome! You can move in on your selected date.' : undefined },
            {
                onSuccess: () => toast.success(decision === 'approved' ? 'Request Approved' : 'Request Rejected', { description: successMsg }),
                onError: (err) => {
                    queryClient.setQueryData(queryKeys.landlordRequests, previous);
                    handleError(err, decision === 'approved' ? 'Approving request' : 'Rejecting request');
                },
            }
        );
    };

    const pendingRequests = requests.filter((r) => r.status === 'pending');
    const decidedRequests = requests.filter((r) => r.status !== 'pending');

    const renderTable = (list: RentalRequest[], showActions: boolean) => (
        <div className="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Tenant</th>
                        <th>Property</th>
                        <th>Move-in</th>
                        <th>Message</th>
                        <th>Status</th>
                        {showActions && <th>Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {list.map((req) => (
                        <tr key={req.id}>
                            <td>
                                <div className="font-bold text-slate-900">{req.tenant?.name || 'Unknown'}</div>
                                <div className="text-xs text-slate-400">{req.tenant?.email}</div>
                            </td>
                            <td>
                                <Link href={`/properties/${req.propertyId}`} className="font-semibold text-slate-800 hover:text-blue-600 transition">
                                    {req.property?.title}
                                </Link>
                                <div className="text-xs text-slate-400">{req.property?.location}</div>
                            </td>
                            <td className="text-xs text-slate-600">{req.moveInDate ? formatDate(req.moveInDate) : '—'}</td>
                            <td className="text-xs text-slate-500 max-w-[220px]">
                                <span className="line-clamp-2">{req.message || '—'}</span>
                            </td>
                            <td>
                                <StatusBadge status={req.status} />
                            </td>
                            {showActions && (
                                <td>
                                    {req.status === 'pending' ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDecision(req, 'approved')}
                                                disabled={updateStatus.isPending}
                                                className="btn-success text-xs px-3 py-1 shadow-sm disabled:opacity-50"
                                            >
                                                <Check className="w-3.5 h-3.5" /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleDecision(req, 'rejected')}
                                                disabled={updateStatus.isPending}
                                                className="btn-danger text-xs px-3 py-1 shadow-sm disabled:opacity-50"
                                            >
                                                <X className="w-3.5 h-3.5" /> Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">
                                            {req.status === 'approved' ? 'Awaiting payment' : 'Decision sent'}
                                        </span>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    if (isLoading) {
        return (
            <div>
                <div className="mb-6">
                    <div className="skeleton h-8 w-56 mb-2" />
                    <div className="skeleton h-4 w-72" />
                </div>
                <TableSkeleton rows={5} />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900">Rental Requests</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Review and manage incoming rental requests for your properties.
                </p>
            </div>

            <div className="card p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <Inbox className="w-4 h-4 text-amber-500" /> Pending Requests
                        <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                            {pendingRequests.length}
                        </span>
                    </h2>
                </div>

                {pendingRequests.length === 0 ? (
                    <EmptyState icon={Inbox} title="No pending requests" description="You're all caught up!" />
                ) : (
                    renderTable(pendingRequests, true)
                )}

                {updateStatus.isPending && (
                    <p className="flex items-center gap-2 text-xs text-slate-400 mt-3">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating request status...
                    </p>
                )}
            </div>

            <div className="card p-6">
                <h2 className="font-bold text-lg text-slate-900 mb-4">Decision History</h2>
                {decidedRequests.length === 0 ? (
                    <p className="text-sm text-slate-400">No decisions made yet.</p>
                ) : (
                    renderTable(decidedRequests, false)
                )}
            </div>
        </div>
    );
}
