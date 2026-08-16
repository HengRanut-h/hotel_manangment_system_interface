export type SettingValueType =
  | 'String'
  | 'Number'
  | 'Boolean'
  | 'Json';

export type SettingCategory =
  | 'General'
  | 'Hotel'
  | 'Localization'
  | 'Finance'
  | 'Reservation'
  | 'Security'
  | 'Notification'
  | 'Integration'
  | 'System'
  | 'Other';

export type SortDirection =
  | 'asc'
  | 'desc';

export type SettingSortField =
  | 'key'
  | 'name'
  | 'category'
  | 'valueType'
  | 'isActive'
  | 'updatedAtUtc';

export interface SettingItem {
  id: string;

  hotelId?: string | null;

  key: string;
  name: string;

  description?: string | null;

  category?: SettingCategory | string | null;

  valueType?: SettingValueType | string | null;

  value?: string | null;
  defaultValue?: string | null;

  isSensitive?: boolean;
  isReadOnly?: boolean;
  isSystem?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;

  createdAtUtc?: string | null;
  updatedAtUtc?: string | null;
}

export interface SettingQuery {
  pageNumber?: number;
  pageSize?: number;

  search?: string;

  category?: string;
  valueType?: string;
  isActive?: boolean;
  includeDeleted?: boolean;

  sortBy?: SettingSortField;
  sortDirection?: SortDirection;
}

export interface SettingPagedResult {
  items: SettingItem[];

  pageNumber: number;
  pageSize: number;

  totalCount: number;
  totalPages: number;

  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface SettingUpsertRequest {
  key: string;
  name: string;

  description?: string | null;

  category: string;
  valueType: string;

  value?: string | null;
  defaultValue?: string | null;

  isSensitive: boolean;
  isReadOnly: boolean;
  isSystem: boolean;
  isActive: boolean;
}

export interface SettingActiveRequest {
  isActive: boolean;
}
