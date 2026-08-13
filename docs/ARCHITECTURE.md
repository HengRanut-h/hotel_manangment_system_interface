# Frontend Architecture

## 1. Core

`core/` contains application-wide infrastructure only:

- `auth/`: JWT session, refresh-token rotation, current user
- `guards/`: authentication, guest/staff portal and permission guards
- `interceptors/`: bearer token, automatic refresh, global HTTP errors
- `http/`: API client
- `navigation/`: permission-filtered business navigation
- `signalr/`: authenticated hotel hub connection

## 2. Layouts

- `AuthLayoutComponent`: authentication pages
- `AppLayoutComponent`: staff/manager/finance/admin application shell
- `GuestLayoutComponent`: lightweight guest portal

The main shell uses a dark, compact business sidebar and a light analytics workspace inspired by modern finance/operations dashboards.

## 3. Shared UI

No third-party UI component library is used. Internal reusable components include:

- Toast
- Modal
- Pager
- Status badge
- Navigation icon adapter
- Data explorer
- Resource CRUD workbench
- SVG line chart
- CSS bar chart
- CSS conic-gradient donut chart

## 4. Business domains

Feature routes are grouped by hotel business responsibility instead of creating duplicate portal applications:

- Front Office
- Property
- Finance
- Operations
- Inventory & Purchasing
- Human Resources
- Administration

Roles and permissions control which navigation items and routes are available.

## 5. State

Angular Signals are used for page state, authentication state, search, pagination, loading state and modal state. API-backed pages remain feature-local instead of introducing a large global store too early.

## 6. Security

Angular route/UI checks improve UX only. ASP.NET Core remains the security authority. The frontend sends the JWT and handles refresh-token rotation, but every protected API must still enforce roles/permissions and hotel/branch scope server-side.
