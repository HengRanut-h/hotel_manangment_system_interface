# Frontend Multi-Function Update

This frontend has been updated to match the newer ASP.NET Core API response contract and the expanded controller actions.

## API response compatibility

`ApiClientService` now supports both:

- raw legacy responses
- wrapped API responses with `success`, `status`, `code`, `message`, `data`, `meta`, `timestampUtc`, and `traceId`

Paged wrapped responses are automatically converted back into the frontend `PagedResult<T>` shape so existing pages continue to work.

## Reusable Catalog workbench

Catalog resources now support:

- list
- get by id / details
- create
- update
- active / inactive
- delete
- restore API support
- search
- active filter
- sort
- ascending / descending
- page-size selection
- pagination
- current-page CSV export
- refresh

Restore buttons only appear when a returned row is marked deleted. The current backend normally filters deleted rows from list results, so a deleted-record listing endpoint/query would be needed to expose restore as a normal browsing workflow.

## Reusable Operational workbench

Operational resources now support:

- list
- get by id / details
- create
- update
- status change
- delete
- search
- status filter
- sort
- ascending / descending
- page-size selection
- pagination
- current-page CSV export
- refresh

## Dedicated workflows

Existing dedicated pages remain available for:

- rooms and room status
- room types and active/inactive
- reservations, cancel, check-in and check-out
- users, roles, enable/disable, password reset and delete
- utilities, meters and readings
- housekeeping and maintenance completion
- inventory and stock adjustment
- folios
- invoices and payments
- reports
- restaurant
- notifications
- dashboard analytics

## Backend proxy

The project still expects the backend through the Angular proxy at `/api/v1` and `/hubs`.
