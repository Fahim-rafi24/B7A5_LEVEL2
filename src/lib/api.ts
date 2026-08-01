import axios, { AxiosError } from 'axios';

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = unknown> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
    errors?: unknown;
}

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

type RetriableConfig = {
    _retry?: boolean;
};

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as (typeof error.config & RetriableConfig) | undefined;
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
                return api(originalRequest);
            } catch {
                // Refresh failed — let the caller handle the original 401
            }
        }
        return Promise.reject(error);
    }
);

export function unwrap<T>(response: { data: ApiResponse<T> }): T {
    if (!response.data?.success) {
        throw new Error(response.data?.message || 'Request failed');
    }
    return response.data.data;
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
    if (axios.isAxiosError(error)) {
        const payload = error.response?.data as ApiResponse | undefined;
        if (payload?.message) return payload.message;
        switch (error.response?.status) {
            case 401:
                return 'Your session has expired. Please sign in again.';
            case 403:
                return 'You do not have permission to perform this action.';
            case 404:
                return 'The requested resource was not found.';
            case 409:
                return 'This record already exists or conflicts with existing data.';
            default:
                if (error.response && error.response.status >= 500) {
                    return 'Something went wrong on the server. Please try again later.';
                }
        }
        if (!error.response) {
            return 'Network error. Please check your connection and try again.';
        }
    }
    return fallback;
}
