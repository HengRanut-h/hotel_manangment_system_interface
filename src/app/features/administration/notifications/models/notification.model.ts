export type NotificationType =
  | 'Info'
  | 'Success'
  | 'Warning'
  | 'Error'
  | 'Reservation'
  | 'Payment'
  | 'Housekeeping'
  | 'Maintenance'
  | 'System'
  | 'Other';

export type NotificationPriority =
  | 'Low'
  | 'Normal'
  | 'High'
  | 'Urgent';

export interface NotificationItem {
  id: string;

  userId?: string | null;
  hotelId?: string | null;

  title: string;
  message: string;

  type?: NotificationType | string | null;
  priority?: NotificationPriority | string | null;

  source?: string | null;

  entityType?: string | null;
  entityId?: string | null;

  actionUrl?: string | null;

  isRead?: boolean;
  readAtUtc?: string | null;

  isArchived?: boolean;
  archivedAtUtc?: string | null;

  isDeleted?: boolean;

  createdAtUtc?: string | null;
  updatedAtUtc?: string | null;
}

export interface NotificationQuery {
  pageNumber?: number;
  pageSize?: number;

  search?: string;

  isRead?: boolean;
  isArchived?: boolean;

  type?: string;
  priority?: string;

  sortBy?: NotificationSortField;
  sortDirection?: SortDirection;
}

export type NotificationSortField =
  | 'title'
  | 'type'
  | 'priority'
  | 'isRead'
  | 'createdAtUtc';

export type SortDirection =
  | 'asc'
  | 'desc';

export interface NotificationPagedResult {
  items: NotificationItem[];

  pageNumber: number;
  pageSize: number;

  totalCount: number;
  totalPages: number;

  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface NotificationUnreadCount {
  unreadCount: number;
}
