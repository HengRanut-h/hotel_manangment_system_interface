# HotelManagement.Web-PURE

A clean Angular 21 hotel-management frontend built with **TypeScript + HTML + plain CSS + Lucide Angular**.

There is deliberately **no Tailwind CSS, no PrimeNG, and no Spartan UI**. Tables, cards, modal windows, pagination, badges, toasts, charts, navigation, forms and responsive layouts are implemented inside this project.

## Stack

- Angular 21 standalone application
- TypeScript 5.9
- HTML + component CSS
- `@lucide/angular`
- Angular Signals
- Angular Router lazy routes
- Angular HttpClient functional interceptors
- SignalR client
- ASP.NET Core API at `/api/v1`

## Architecture

```text
src/app/
├── core/                 # auth, guards, interceptors, HTTP, navigation, SignalR
├── layouts/              # auth, staff application, guest portal layouts
├── shared/               # internal UI kit, charts, resource CRUD engine
└── features/             # hotel business domains
    ├── authentication/
    ├── dashboard/
    ├── front-office/
    ├── property/
    ├── finance/
    ├── operations/
    ├── inventory/
    ├── hr/
    ├── administration/
    ├── guest/
    └── profile/
```

## Start

Backend should run at `http://localhost:5174`.

```powershell
npm install
npm start
```

Open `http://localhost:4200`.

Development account seeded by the backend:

```text
admin@hotel.local
ChangeMe123!
```

## Important Users-list rule

`features/administration/pages/users/users.page.ts` filters the currently authenticated user by **user ID** before rendering the list. Self-disable, self-delete, self-password-reset and self-edit actions from this administration screen are therefore unavailable by design.

## Dashboard analytics

The dashboard aggregates the backend Dashboard, Reports, Reservations, Payments, Invoices, Housekeeping, Maintenance, Inventory and Employees APIs. It includes:

- total revenue
- occupancy
- arrivals
- available rooms
- outstanding balance
- staff count
- 12-month revenue trend
- 7-day occupancy chart
- room allocation donut
- payment-method mix
- reservation-status mix
- operations health
- recent reservations
- RevPAR-style estimate

Charts are custom SVG/CSS components; no chart library is required.

## Multi-function API update

The frontend now understands the backend `ApiResponse<T>` wrapper and automatically preserves pagination metadata. The reusable resource workbench now includes details, search, filters, sorting, page-size control, CSV export, catalog active/inactive actions, and operational status changes. See `FRONTEND_MULTI_FUNCTION_UPDATE.md`.

## Build verification

```powershell
npm run build
```

The project intentionally targets Angular 21 so it works with Node 22.16.x as well as Angular's supported newer Node 22 versions.
