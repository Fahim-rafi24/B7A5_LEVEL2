# RentNest — Frontend

A full-stack property rental marketplace. This is the **Next.js 14 frontend** that talks to the
Express + Prisma + PostgreSQL API running on `http://localhost:5000/api`.

Built with Next.js App Router, TypeScript, Tailwind CSS, TanStack React Query, Axios, Sonner and
Stripe.js. Authentication uses httpOnly JWT cookies with automatic token refresh.

## Tech Stack

- **Framework:** Next.js 14.2 (App Router), TypeScript
- **Styling:** Tailwind CSS 3, Lucide icons
- **Data fetching:** TanStack React Query, Axios (with 401-refresh interceptor)
- **Auth:** httpOnly JWT cookies (`accessToken` / `refreshToken`) + role-based middleware
- **Payments:** Stripe.js (PaymentIntent) with a sandbox mock fallback
- **Toasts:** Sonner

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

Copy `.env.example` to `.env.local` and adjust:

| Variable                              | Description                                             |
| ------------------------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`            | Backend base URL, default `http://localhost:5000/api`   |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`  | Stripe publishable key (leave empty for mock mode)      |

> **CORS:** the backend only allows `http://localhost:5173`. Either run this app with
> `npm run dev -p 5173` or add `http://localhost:3000` to the backend's `SITE_URL` env var.

## Demo Accounts

| Role     | Email                | Password     |
| -------- | -------------------- | ------------ |
| Admin    | `admin@rentnest.com` | `admin123`   |
| Landlord | `rahim@rentnest.com` | `password123` |
| Tenant   | `aarif@gmail.com`    | `password123` |

You can also use the **Demo Sign In** dropdown in the navbar, which fills in one of the accounts above.

## Scripts

| Command            | Description                            |
| ------------------ | -------------------------------------- |
| `npm run dev`      | Start the dev server                   |
| `npm run build`    | Production build (type-checks + lints) |
| `npm run start`    | Serve the production build             |
| `npm run lint`     | Run ESLint                             |

## Project Structure

```
src/
├── app/                 # App Router pages (auth, dashboard, properties, payment)
├── components/          # Reusable UI (Navbar, modals, cards, forms, skeletons)
├── context/             # AuthProvider (login/logout/demo accounts, role)
├── hooks/               # React Query hooks (queries.ts, mutations.ts)
├── lib/                 # api.ts (axios + refresh), utils.ts (formatting)
├── middleware.ts        # Role-based route protection (Edge runtime)
└── types/               # Shared TypeScript models
```

See [API_INTEGRATION.md](./API_INTEGRATION.md) for the full backend endpoint mapping.
