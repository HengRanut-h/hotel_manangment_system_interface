export interface Tax {
  id: string;
  hotelId?: string | null;

  name: string;
  code?: string | null;
  description?: string | null;

  type?: TaxType | string | null;

  rate: number;

  isPercentage?: boolean;
  isInclusive?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;

  appliesTo?: TaxAppliesTo | string | null;

  effectiveFromUtc?: string | null;
  effectiveToUtc?: string | null;

  createdAtUtc?: string | null;
  updatedAtUtc?: string | null;
}

export type TaxType =
  | 'VAT'
  | 'GST'
  | 'ServiceTax'
  | 'CityTax'
  | 'TourismTax'
  | 'OccupancyTax'
  | 'Other';

export type TaxAppliesTo =
  | 'Room'
  | 'Restaurant'
  | 'Service'
  | 'Laundry'
  | 'Transportation'
  | 'Invoice'
  | 'All';

export type TaxSortField =
  | 'name'
  | 'code'
  | 'type'
  | 'rate'
  | 'appliesTo'
  | 'effectiveFromUtc'
  | 'effectiveToUtc';

export type SortDirection =
  | 'asc'
  | 'desc';

export interface TaxQuery {
  pageNumber?: number;
  pageSize?: number;

  search?: string;
  type?: string;
  appliesTo?: string;
  isActive?: boolean;

  sortBy?: TaxSortField;
  sortDirection?: SortDirection;
}

export interface TaxPagedResult {
  items: Tax[];

  pageNumber: number;
  pageSize: number;

  totalCount: number;
  totalPages: number;

  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface TaxUpsertRequest {
  name: string;
  code?: string | null;
  description?: string | null;

  type: TaxType | string;

  rate: number;

  isPercentage: boolean;
  isInclusive: boolean;
  isActive: boolean;

  appliesTo: TaxAppliesTo | string;

  effectiveFromUtc?: string | null;
  effectiveToUtc?: string | null;
}

export interface TaxActiveRequest {
  isActive: boolean;
}
