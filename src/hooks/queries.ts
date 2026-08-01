'use client';

import { useQuery } from '@tanstack/react-query';
import { api, unwrap } from '@/lib/api';
import type {
  AdminPropertiesResult,
  AdminRentalsResult,
  AdminUsersResult,
  Category,
  PaginatedProperties,
  Payment,
  Property,
  RentalRequest,
} from '@/types';

export const queryKeys = {
  categories: ['categories'] as const,
  properties: (filters: object) => ['properties', filters] as const,
  featuredProperties: ['properties', 'featured'] as const,
  property: (id: string) => ['properties', id] as const,
  reviews: (propertyId: string) => ['reviews', propertyId] as const,
  rentals: ['rentals'] as const,
  payments: ['payments'] as const,
  landlordProperties: ['landlord', 'properties'] as const,
  landlordRequests: ['landlord', 'requests'] as const,
  adminUsers: (page: number, limit: number) => ['admin', 'users', page, limit] as const,
  adminProperties: (page: number, limit: number) => ['admin', 'properties', page, limit] as const,
  adminRentals: (page: number, limit: number) => ['admin', 'rentals', page, limit] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: async () => unwrap<Category[]>(await api.get('/categories')),
  });
}

export interface PropertyFilters {
  search?: string;
  location?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  categoryId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export function useProperties(filters: PropertyFilters = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.properties(filters),
    queryFn: async () =>
      unwrap<PaginatedProperties>(await api.get('/properties', { params: filters })),
    enabled,
  });
}

export function useFeaturedProperties(limit = 6) {
  return useQuery({
    queryKey: [...queryKeys.featuredProperties, limit],
    queryFn: async () =>
      unwrap<PaginatedProperties>(await api.get('/properties', { params: { limit, page: 1 } })),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: queryKeys.property(id),
    queryFn: async () => unwrap<Property>(await api.get(`/properties/${id}`)),
    enabled: Boolean(id),
  });
}

export function usePropertyReviews(propertyId: string) {
  return useQuery({
    queryKey: queryKeys.reviews(propertyId),
    queryFn: async () => unwrap<Property['reviews']>(await api.get(`/properties/${propertyId}/reviews`)),
    enabled: Boolean(propertyId),
  });
}

export function useRentals() {
  return useQuery({
    queryKey: queryKeys.rentals,
    queryFn: async () => unwrap<RentalRequest[]>(await api.get('/rentals')),
  });
}

export function usePayments() {
  return useQuery({
    queryKey: queryKeys.payments,
    queryFn: async () => unwrap<Payment[]>(await api.get('/payments')),
  });
}

export function useLandlordProperties() {
  return useQuery({
    queryKey: queryKeys.landlordProperties,
    queryFn: async () => unwrap<Property[]>(await api.get('/landlord/properties')),
  });
}

export function useLandlordRequests() {
  return useQuery({
    queryKey: queryKeys.landlordRequests,
    queryFn: async () => unwrap<RentalRequest[]>(await api.get('/landlord/requests')),
  });
}

export function useAdminUsers(page = 1, limit = 10) {
  return useQuery({
    queryKey: queryKeys.adminUsers(page, limit),
    queryFn: async () =>
      unwrap<AdminUsersResult>(await api.get('/admin/users', { params: { page, limit } })),
  });
}

export function useAdminProperties(page = 1, limit = 10) {
  return useQuery({
    queryKey: queryKeys.adminProperties(page, limit),
    queryFn: async () =>
      unwrap<AdminPropertiesResult>(await api.get('/admin/properties', { params: { page, limit } })),
  });
}

export function useAdminRentals(page = 1, limit = 10) {
  return useQuery({
    queryKey: queryKeys.adminRentals(page, limit),
    queryFn: async () =>
      unwrap<AdminRentalsResult>(await api.get('/admin/rentals', { params: { page, limit } })),
  });
}
