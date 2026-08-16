export interface Discount {
  id: string;
  hotelId?: string | null;

  name: string;
  code?: string | null;
  description?: string | null;

  type?: DiscountType | string | null;
  value: number;

  isPercentage?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;

  appliesTo?: DiscountAppliesTo | string | null;

  minimumAmount?: number | null;
  maximumDiscountAmount?: number | null;

  validFromUtc?: string | null;
  validToUtc?: string | null;

  usageLimit?: number | null;
  usedCount?: number | null;

  createdAtUtc?: string | null;
  updatedAtUtc?: string | null;
}

export type DiscountType =
  | 'Percentage'
  | 'FixedAmount'
  | 'PromoCode'
  | 'Seasonal'
  | 'Loyalty'
  | 'Corporate'
  | 'Manual'
  | 'Other';

export type DiscountAppliesTo =
  | 'Room'
  | 'Restaurant'
  | 'Service'
  | 'Laundry'
  | 'Transportation'
  | 'Invoice'
  | 'All';

export type DiscountSortField =
  | 'name'
  | 'code'
  | 'type'
  | 'value'
  | 'appliesTo'
  | 'validFromUtc'
  | 'validToUtc';

export type SortDirection =
  | 'asc'
  | 'desc';

export interface DiscountQuery {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  type?: string;
  appliesTo?: string;
  isActive?: boolean;
  sortBy?: DiscountSortField;
  sortDirection?: SortDirection;
}

export interface DiscountPagedResult {
  items: Discount[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface DiscountUpsertRequest {
  name: string;
  code?: string | null;
  description?: string | null;

  type: DiscountType | string;
  value: number;

  isPercentage: boolean;
  isActive: boolean;

  appliesTo: DiscountAppliesTo | string;

  minimumAmount?: number | null;
  maximumDiscountAmount?: number | null;

  validFromUtc?: string | null;
  validToUtc?: string | null;

  usageLimit?: number | null;
}

export interface DiscountActiveRequest {
  isActive: boolean;
}
