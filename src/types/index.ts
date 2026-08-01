export type UserRole = 'tenant' | 'landlord' | 'admin';
export type UserStatus = 'active' | 'banned';

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role: UserRole;
    status: UserStatus;
    createdAt?: string;
    updatedAt?: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string | null;
    _count?: { properties: number };
}

export type PropertyStatus = 'available' | 'rented' | string;

export interface Property {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    bedrooms?: number | null;
    bathrooms?: number | null;
    area?: number | null;
    amenities: string[];
    images: string[];
    status: PropertyStatus;
    category?: Category | null;
    landlord?: { id: string; name: string; email?: string; phone?: string } | null;
    reviews?: Review[];
    categoryId?: string;
    landlordId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaginatedProperties {
    properties: Property[];
    total: number;
    page: number;
    limit: number;
}

export type RentalStatus =
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'active'
    | 'completed'
    | 'cancelled';

export interface RentalRequest {
    id: string;
    status: RentalStatus;
    moveInDate?: string | null;
    message?: string | null;
    landlordNote?: string | null;
    tenant?: Pick<User, 'id' | 'name' | 'email' | 'phone'> | null;
    property?: Property | null;
    payment?: Payment | null;
    tenantId?: string;
    propertyId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentProvider = 'stripe' | 'sslcommerz';

export interface Payment {
    id: string;
    rentalRequestId?: string;
    amount: number;
    currency: string;
    provider: PaymentProvider;
    providerPaymentId?: string | null;
    transactionId?: string | null;
    status: PaymentStatus;
    paidAt?: string | null;
    userId?: string;
    rentalRequest?: RentalRequest | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface Review {
    id: string;
    tenantId?: string;
    propertyId?: string;
    rating: number;
    comment?: string | null;
    tenant?: { id: string; name: string };
    createdAt?: string;
}

export interface Paginated<T> {
    users?: T;
    properties?: T;
    rentals?: T;
    total: number;
    page: number;
    limit: number;
}

export interface AdminUsersResult {
    users: User[];
    total: number;
    page: number;
    limit: number;
}

export interface AdminPropertiesResult {
    properties: Property[];
    total: number;
    page: number;
    limit: number;
}

export interface AdminRentalsResult {
    rentals: RentalRequest[];
    total: number;
    page: number;
    limit: number;
}

export interface CreatePaymentResult {
    payment: Payment;
    clientSecret?: string | null;
}
