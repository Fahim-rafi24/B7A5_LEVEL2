'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, unwrap, getErrorMessage } from '@/lib/api';
import { toast } from 'sonner';
import type {
  Category,
  CreatePaymentResult,
  Payment,
  Property,
  RentalRequest,
  RentalStatus,
  Review,
  User,
} from '@/types';
import { queryKeys } from './queries';

function invalidate(client: ReturnType<typeof useQueryClient>, keys: ReadonlyArray<readonly unknown[]>) {
  keys.forEach((key) => client.invalidateQueries({ queryKey: key }));
}

export interface RentalPayload {
  propertyId: string;
  moveInDate?: string;
  message?: string;
}

export function useSubmitRental() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RentalPayload) =>
      unwrap<RentalRequest>(await api.post('/rentals', payload)),
    onSuccess: () => invalidate(client, [queryKeys.rentals]),
  });
}

export function useUpdateRequestStatus() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, landlordNote }: { id: string; status: RentalStatus; landlordNote?: string }) =>
      unwrap<RentalRequest>(await api.patch(`/landlord/requests/${id}`, { status, landlordNote })),
    onSuccess: () => invalidate(client, [queryKeys.landlordRequests, queryKeys.landlordProperties, queryKeys.rentals]),
  });
}

export interface PropertyPayload {
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities?: string[];
  images?: string[];
  categoryId: string;
  status?: string;
}

export function useCreateProperty() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PropertyPayload) =>
      unwrap<Property>(await api.post('/landlord/properties', payload)),
    onSuccess: () => invalidate(client, [queryKeys.landlordProperties, queryKeys.featuredProperties]),
  });
}

export function useUpdateProperty() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<PropertyPayload> }) =>
      unwrap<Property>(await api.put(`/landlord/properties/${id}`, payload)),
    onSuccess: () => invalidate(client, [queryKeys.landlordProperties, queryKeys.featuredProperties]),
  });
}

export function useDeleteProperty() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => unwrap<null>(await api.delete(`/landlord/properties/${id}`)),
    onSuccess: () => invalidate(client, [queryKeys.landlordProperties, queryKeys.featuredProperties]),
  });
}

export function useToggleUserStatus() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'banned' }) =>
      unwrap<User>(await api.patch(`/admin/users/${id}`, { status })),
    onSuccess: () => invalidate(client, [queryKeys.adminUsers(1, 10)]),
  });
}

export function useCreateCategory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; description?: string }) =>
      unwrap<Category>(await api.post('/admin/categories', payload)),
    onSuccess: () => invalidate(client, [queryKeys.categories]),
  });
}

export function useDeleteCategory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => unwrap<null>(await api.delete(`/admin/categories/${id}`)),
    onSuccess: () => invalidate(client, [queryKeys.categories]),
  });
}

export function useCreateReview() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { propertyId: string; rating: number; comment?: string }) =>
      unwrap<Review>(await api.post('/reviews', payload)),
    onSuccess: (review) => invalidate(client, [queryKeys.reviews(review.propertyId || ''), queryKeys.rentals]),
  });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: async (payload: { rentalRequestId: string; provider: 'stripe' | 'sslcommerz' }) =>
      unwrap<CreatePaymentResult>(await api.post('/payments/create', payload)),
  });
}

export function useConfirmPayment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { paymentId: string; transactionId?: string }) =>
      unwrap<Payment>(await api.post('/payments/confirm', payload)),
    onSuccess: () => invalidate(client, [queryKeys.rentals, queryKeys.payments]),
  });
}

export function useHandleMutationError() {
  return (error: unknown, action: string) => {
    toast.error(getErrorMessage(error, `${action} failed. Please try again.`));
  };
}
