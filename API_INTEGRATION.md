# RentNest Frontend ↔ Backend Integration

Base URL: `http://localhost:5000/api` (override with `NEXT_PUBLIC_API_BASE_URL`).

The axios instance in `src/lib/api.ts` sends cookies with `withCredentials` and transparently calls
`POST /auth/refresh` once when a request returns `401`, then retries the original request.

## Auth & Users

| Method | Endpoint             | Auth | Used by                                   |
| ------ | -------------------- | ---- | ----------------------------------------- |
| POST   | `/auth/register`     | –    | `src/app/auth/register`                   |
| POST   | `/auth/login`        | –    | `src/app/auth/login`, `AuthContext`       |
| GET    | `/auth/me`           | ✓    | `AuthContext` (on mount / refresh)        |
| POST   | `/auth/refresh`      | –    | axios interceptor                         |
| POST   | `/auth/logout`       | –    | `AuthContext.logout`                      |
| GET    | `/users/me`          | ✓    | alias for `/auth/me`                      |

Register payload: `{ name, email, password, role?, phone? }` — password needs ≥8 chars, 2 digits
and 1 special char.

## Public

| Method | Endpoint                    | Query / Notes                                      | Used by                            |
| ------ | --------------------------- | -------------------------------------------------- | ---------------------------------- |
| GET    | `/categories`               | –                                                  | `useCategories` (all pages)        |
| GET    | `/properties`               | `search, location, minPrice, maxPrice, categoryId, status, page, limit` | `src/app/properties`, home, SearchBar |
| GET    | `/properties/:id`           | includes `category`, `landlord`, `reviews`         | `src/app/properties/[id]`          |
| GET    | `/properties/:id/reviews`   | –                                                  | `usePropertyReviews`               |

## Tenant

| Method | Endpoint               | Auth   | Notes                                        | Used by                          |
| ------ | ---------------------- | ------ | -------------------------------------------- | -------------------------------- |
| POST   | `/rentals`             | tenant | `{ propertyId, moveInDate?, message? }`      | `RequestRentModal`               |
| GET    | `/rentals`             | ✓      | current user's rentals (with `property`)     | `dashboard/tenant`, `payment/init` |
| GET    | `/rentals/:id`         | ✓      | –                                            | –                                |
| POST   | `/payments/create`     | tenant | `{ rentalRequestId, provider: 'stripe' \| 'sslcommerz' }` → `{ payment, clientSecret }` | `payment/init` |
| POST   | `/payments/confirm`    | tenant | `{ paymentId, transactionId }` — marks rental `active` | `payment/init`            |
| GET    | `/payments`            | tenant | –                                            | `dashboard/tenant`              |
| POST   | `/reviews`             | tenant | `{ propertyId, rating, comment? }`           | `ReviewModal`                   |

Rental statuses: `pending → approved → active → completed` (or `rejected / cancelled`).

## Landlord (and admin)

| Method | Endpoint                        | Notes                                  | Used by                              |
| ------ | ------------------------------- | -------------------------------------- | ------------------------------------ |
| GET    | `/landlord/properties`          | own listings                           | `dashboard/landlord`                 |
| POST   | `/landlord/properties`          | create listing                         | `PropertyForm` (`properties/new`)    |
| PUT    | `/landlord/properties/:id`      | update listing / toggle availability   | `PropertyForm` (edit), landlord dash |
| DELETE | `/landlord/properties/:id`      | –                                      | landlord dash                        |
| GET    | `/landlord/requests`            | rental requests on own properties      | `dashboard/landlord/requests`        |
| PATCH  | `/landlord/requests/:id`        | `{ status, landlordNote? }`            | `dashboard/landlord/requests`        |

## Admin

| Method | Endpoint                  | Notes                                            | Used by               |
| ------ | ------------------------- | ------------------------------------------------ | --------------------- |
| GET    | `/admin/users`            | `page, limit`                                    | `dashboard/admin`     |
| PATCH  | `/admin/users/:id`        | `{ status: 'active' \| 'banned' }`               | `dashboard/admin`     |
| GET    | `/admin/properties`       | `page, limit`                                    | `dashboard/admin`     |
| GET    | `/admin/rentals`          | `page, limit`                                    | `dashboard/admin`     |
| POST   | `/admin/categories`       | `{ name }`                                       | `dashboard/admin`     |
| PUT    | `/admin/categories/:id`   | –                                                | –                     |
| DELETE | `/admin/categories/:id`   | –                                                | `dashboard/admin`     |

## Auth Model

- Login/register set httpOnly cookies: `accessToken` (1h) and `refreshToken` (7d), `SameSite=strict`.
- JWT payload: `{ sub: userId, role }`.
- The Edge middleware (`src/middleware.ts`) decodes the `accessToken` cookie to enforce roles on
  `/dashboard/*` and `/payment/init` routes; if only the refresh token is present it requests the
  backend to issue a fresh access token before redirecting.

## Payments

`POST /payments/create` returns a PaymentIntent `clientSecret` when a `STRIPE_SECRET_KEY` is
configured on the backend; otherwise the backend returns a mock `pi_mock_...` client secret. In
sandbox mode the UI skips Stripe.js and calls `POST /payments/confirm` directly to finalize the
rental — see `src/app/payment/init/[requestId]/page.tsx`.
