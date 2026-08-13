# Backend API Map

The frontend is configured for `/api/v1` through `proxy.conf.json`.

## Authentication
- `POST /auth/login`
- `POST /auth/refresh-token`
- `POST /auth/logout`

## Analytics
- `GET /dashboard`
- `GET /reports/revenue`
- `GET /reports/occupancy`

## Front Office
- `/availability`
- `/reservations`
- `/guests`
- `/room-assignments`
- `/room-changes`
- `/stay-extensions`

## Property
- `/hotels`
- `/branches`
- `/buildings`
- `/floors`
- `/room-types`
- `/rooms`
- `/amenities`
- `/rates`

## Finance
- `/folios`
- `/invoices`
- `/payments`
- `/deposits`
- `/refunds`
- `/taxes`
- `/discounts`
- `/utilities`
- `/utility-rates`
- `/utility-meters`
- `/meter-readings`

## Operations
- `/housekeeping`
- `/room-inspections`
- `/maintenance`
- `/services`
- `/guest-requests`
- `/complaints`
- `/lost-and-found`
- `/laundry`
- `/restaurant`
- `/transportation`
- `/security-incidents`

## Inventory & Purchasing
- `/inventory`
- `/warehouses`
- `/stock-transactions`
- `/suppliers`
- `/purchase-requests`
- `/purchase-orders`
- `/goods-receipts`

## Human Resources
- `/employees`
- `/departments`
- `/positions`
- `/shifts`
- `/attendance`
- `/leave-requests`

## Administration
- `/users`
- `/roles`
- `/permissions`
- `/notifications`
- `/audit-logs`
- `/feature-flags`
- `/settings`
