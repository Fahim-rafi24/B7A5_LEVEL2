'use client';

import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Users, Building2, FileText, Clock, Ban, CheckCircle2, Search, Trash2, Plus, X, Tag } from 'lucide-react';
import { useAdminUsers, useAdminProperties, useAdminRentals, useCategories } from '@/hooks/queries';
import {
  useToggleUserStatus,
  useDeleteProperty,
  useCreateCategory,
  useDeleteCategory,
  useHandleMutationError,
} from '@/hooks/mutations';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { TableSkeleton, StatCardSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import Pagination from '@/components/Pagination';
import type { User } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDashboard() {
  const [usersPage, setUsersPage] = useState(1);
  const [propsPage, setPropsPage] = useState(1);
  const [searchUser, setSearchUser] = useState('');

  const { data: usersData, isLoading: usersLoading } = useAdminUsers(usersPage, 10);
  const { data: propsData, isLoading: propsLoading } = useAdminProperties(propsPage, 10);
  const { data: rentalsData, isLoading: rentalsLoading } = useAdminRentals(1, 10);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const toggleStatus = useToggleUserStatus();
  const deleteProperty = useDeleteProperty();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const handleError = useHandleMutationError();

  const [newCategoryName, setNewCategoryName] = useState('');

  const users = useMemo(() => usersData?.users ?? [], [usersData]);
  const properties = useMemo(() => propsData?.properties ?? [], [propsData]);
  const rentals = useMemo(() => rentalsData?.rentals ?? [], [rentalsData]);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
          u.name.toLowerCase().includes(searchUser.toLowerCase())
      ),
    [users, searchUser]
  );

  const pendingRequests = rentals.filter((r) => r.status === 'pending').length;
  const totalEarnings = rentals
    .filter((r) => r.status === 'active' || r.status === 'completed')
    .reduce((sum, r) => sum + (r.property?.price ?? 0), 0);

  const handleToggle = (user: User) => {
    const next = user.status === 'active' ? 'banned' : 'active';
    toggleStatus.mutate(
      { id: user.id, status: next },
      {
        onSuccess: () =>
          toast.success(next === 'banned' ? 'User banned' : 'User unbanned', {
            description: `${user.name} is now ${next}.`,
          }),
        onError: (err) => handleError(err, next === 'banned' ? 'Banning user' : 'Unbanning user'),
      }
    );
  };

  const handleRemoveProperty = (id: string, title: string) => {
    if (!window.confirm(`Remove listing "${title}" from the platform?`)) return;
    deleteProperty.mutate(id, {
      onSuccess: () => toast.success('Listing removed successfully'),
      onError: (err) => handleError(err, 'Removing listing'),
    });
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    createCategory.mutate(
      { name: newCategoryName.trim() },
      {
        onSuccess: () => {
          toast.success(`Category "${newCategoryName.trim()}" created`);
          setNewCategoryName('');
        },
        onError: (err) => handleError(err, 'Creating category'),
      }
    );
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    deleteCategory.mutate(id, {
      onSuccess: () => toast.success('Category deleted'),
      onError: (err) => handleError(err, 'Deleting category'),
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Platform moderation, user & content management center.</p>
      </div>

      {usersLoading || propsLoading || rentalsLoading ? (
        <StatCardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Users" value={usersData?.total ?? users.length} icon={Users} />
          <StatCard label="Total Properties" value={propsData?.total ?? properties.length} icon={Building2} accent="blue" />
          <StatCard label="Pending Requests" value={pendingRequests} icon={Clock} accent="amber" />
          <StatCard label="Platform Revenue" value={formatCurrency(totalEarnings)} icon={FileText} accent="green" />
        </div>
      )}

      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" /> User Management
          </h2>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search user name or email..."
              className="form-input text-xs pl-9"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        {usersLoading ? (
          <TableSkeleton rows={4} />
        ) : filteredUsers.length === 0 ? (
          <EmptyState icon={Users} title="No users found" />
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </td>
                      <td className="capitalize text-xs font-semibold text-slate-600">{u.role}</td>
                      <td>
                        <StatusBadge
                          status={u.status}
                          tone={u.status === 'active' ? 'active' : 'rejected'}
                        />
                      </td>
                      <td className="text-xs text-slate-500">{formatDate(u.createdAt)}</td>
                      <td>
                        {u.status === 'active' ? (
                          <button onClick={() => handleToggle(u)} className="btn-danger text-xs px-3 py-1 shadow-sm">
                            <Ban className="w-3.5 h-3.5" /> Ban
                          </button>
                        ) : (
                          <button onClick={() => handleToggle(u)} className="btn-success text-xs px-3 py-1 shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Unban
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={usersPage} totalPages={Math.max(1, Math.ceil((usersData?.total ?? 0) / 10))} onPageChange={setUsersPage} />
          </>
        )}
      </div>

      <div className="card p-6 mb-8">
        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4 text-blue-600" /> Content & Listing Moderation
        </h2>

        {propsLoading ? (
          <TableSkeleton rows={4} />
        ) : properties.length === 0 ? (
          <EmptyState icon={Building2} title="No properties on the platform" />
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Landlord</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((prop) => (
                    <tr key={prop.id}>
                      <td className="font-bold text-slate-900">{prop.title}</td>
                      <td className="text-xs text-slate-600">{prop.landlord?.email || '—'}</td>
                      <td className="font-semibold text-blue-600">{formatCurrency(prop.price)}/mo</td>
                      <td>
                        <StatusBadge status={prop.status} tone={prop.status === 'available' ? 'active' : 'completed'} />
                      </td>
                      <td>
                        <button
                          onClick={() => handleRemoveProperty(prop.id, prop.title)}
                          className="text-xs text-red-500 hover:underline font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={propsPage} totalPages={Math.max(1, Math.ceil((propsData?.total ?? 0) / 10))} onPageChange={setPropsPage} />
          </>
        )}
      </div>

      <div className="card p-6 mb-8">
        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-blue-600" /> All Rental Requests
        </h2>

        {rentalsLoading ? (
          <TableSkeleton rows={4} />
        ) : rentals.length === 0 ? (
          <EmptyState icon={FileText} title="No rental requests yet" />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Property</th>
                  <th>Status</th>
                  <th>Requested</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="font-bold text-slate-900">{r.tenant?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-400">{r.tenant?.email}</div>
                    </td>
                    <td className="font-semibold text-slate-800">{r.property?.title}</td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="text-xs text-slate-500">{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card p-6">
        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4 text-blue-600" /> Category Management
        </h2>

        <form onSubmit={handleCreateCategory} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            required
            placeholder="New category name (e.g. Townhouse)"
            className="form-input text-sm flex-1"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button type="submit" disabled={createCategory.isPending} className="btn-primary text-sm justify-center">
            <Plus className="w-4 h-4" /> {createCategory.isPending ? 'Adding...' : 'Add Category'}
          </button>
        </form>

        {categoriesLoading ? (
          <TableSkeleton rows={3} />
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2 pl-4 pr-2 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-sm">
                <span className="font-medium text-slate-700">{cat.name}</span>
                <span className="text-[11px] text-slate-400">{cat._count?.properties ?? 0}</span>
                <button
                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                  className="text-slate-400 hover:text-red-600 transition"
                  title="Delete category"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
