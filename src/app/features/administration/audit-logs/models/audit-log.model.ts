export interface AuditLog {
  id: string;

  hotelId?: string | null;
  hotelName?: string | null;

  userId?: string | null;
  userName?: string | null;
  userEmail?: string | null;

  action: string;

  entityName?: string | null;
  entityId?: string | null;

  module?: string | null;

  description?: string | null;

  oldValues?: string | null;
  newValues?: string | null;

  ipAddress?: string | null;
  userAgent?: string | null;
  correlationId?: string | null;

  requestMethod?: string | null;
  requestPath?: string | null;

  succeeded?: boolean | null;
  errorMessage?: string | null;

  createdAtUtc: string;
}

export interface AuditLogQuery {
  pageNumber?: number;
  pageSize?: number;

  search?: string;

  action?: string;
  entityName?: string;
  module?: string;
  userId?: string;

  fromUtc?: string;
  toUtc?: string;

  succeeded?: boolean;

  sortBy?: AuditLogSortField;
  sortDirection?: SortDirection;
}

export type AuditLogSortField =
  | 'createdAtUtc'
  | 'action'
  | 'entityName'
  | 'module'
  | 'userName';

export type SortDirection =
  | 'asc'
  | 'desc';

export interface AuditLogPagedResult {
  items: AuditLog[];

  pageNumber: number;
  pageSize: number;

  totalCount: number;
  totalPages: number;

  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}
