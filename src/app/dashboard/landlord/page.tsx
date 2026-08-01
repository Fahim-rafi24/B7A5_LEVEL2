'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLandlordProperties, useLandlordRequests } from '@/hooks/queries';
import { useUpdateProperty, useDeleteProperty, useHandleMutationError } from '@/hooks/mutations';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { TableSkeleton, StatCardSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import { Plus, Building2, Wallet, Clock, Inbox, Pencil, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

export default function LandlordDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: properties = [], isLoading: propsLoading } = useLandlordProperties();
  const { data: requests = [], isLoading: reqsLoading } = useLandlordRequests();

  const updateProperty = useUpdateProperty();
  const deleteProperty = useDeleteProperty();
  const handleError = useHandleMutationError();

  const availableCount = properties.filter((p) => p.status === 'available').length;
  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const totalEarnings = requests
    .filter((r) => r.status === 'active' || r.status === 'completed')
    .reduce((sum, r) => sum + (r.property?.price ?? 0), 0);

  const handleToggleAvailability = (id: string, current: string) => {
    const next = current === 'available' ? 'rented' : 'available';
    updateProperty.mutate(
      { id, payload: { status: next } },
      {
        onSuccess: () =>
          toast.success(next === 'available' ? 'Property is now available' : 'Property marked as rented'),
        onError: (err) => handleError(err, 'Updating availability'),
      }
    );
  };

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This action cannot be undone.`)) return;
    deleteProperty.mutate(id, {
      onSuccess: () => toast.success('Property deleted successfully'),
      onError: (err) => handleError(err, 'Deleting property'),
    });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Landlord Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome back{user?.name ? `, ${user.name}` : ''}! Manage your properties and tenant requests.
          </p>
        </div>
        <Link href="/dashboard/landlord/properties/new" className="btn-primary text-xs px-5 py-2.5 shadow-md">
          <Plus className="w-4 h-4" /> Add New Property
        </Link>
      </div>

      {propsLoading || reqsLoading ? (
        <StatCardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Properties" value={properties.length} icon={Building2} />
          <StatCard label="Active Listings" value={availableCount} icon={ToggleRight} accent="green" />
          <StatCard label="Pending Requests" value={pendingCount} icon={Clock} accent="amber" />
          <StatCard label="Total Earnings" value={formatCurrency(totalEarnings)} icon={Wallet} accent="blue" />
        </div>
      )}

      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" /> Your Listed Properties
          </h2>
          <Link href="/dashboard/landlord/properties/new" className="text-xs text-blue-600 font-semibold hover:underline">
            + Add Property
          </Link>
        </div>

        {propsLoading ? (
          <TableSkeleton rows={4} />
        ) : properties.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No properties yet"
            description="List your first property and start receiving rental requests."
            action={
              <Link href="/dashboard/landlord/properties/new" className="btn-primary text-xs">
                <Plus className="w-3.5 h-3.5" /> Add Property
              </Link>
            }
          />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Category</th>
                  <th>Monthly Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((prop) => (
                  <tr key={prop.id}>
                    <td className="font-bold text-slate-900">{prop.title}</td>
                    <td className="text-xs text-slate-600">{prop.category?.name || '—'}</td>
                    <td className="font-semibold text-blue-600">{formatCurrency(prop.price)}/mo</td>
                    <td>
                      <StatusBadge
                        status={prop.status}
                        tone={prop.status === 'available' ? 'active' : 'completed'}
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/properties/${prop.id}`}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleAvailability(prop.id, prop.status)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title={prop.status === 'available' ? 'Mark as rented' : 'Mark as available'}
                        >
                          {prop.status === 'available' ? (
                            <ToggleLeft className="w-4 h-4" />
                          ) : (
                            <ToggleRight className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/landlord/properties/${prop.id}/edit`)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prop.id, prop.title)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
            <Inbox className="w-4 h-4 text-blue-600" /> Recent Rental Requests
          </h2>
          <Link href="/dashboard/landlord/requests" className="text-xs text-blue-600 font-semibold hover:underline">
            View all
          </Link>
        </div>

        {reqsLoading ? (
          <TableSkeleton rows={3} />
        ) : requests.length === 0 ? (
          <EmptyState icon={Inbox} title="No incoming requests yet" />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Property</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 5).map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div className="font-bold text-slate-900">{req.tenant?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-400">{req.tenant?.email}</div>
                    </td>
                    <td className="font-semibold text-slate-800">{req.property?.title}</td>
                    <td>
                      <StatusBadge status={req.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
