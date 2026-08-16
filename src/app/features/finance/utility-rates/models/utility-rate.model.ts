export interface UtilityRate {
  id: string;
  hotelId?: string | null;

  utilityId: string;
  utilityName?: string | null;
  utilityType?: string | null;

  name?: string | null;
  code?: string | null;

  ratePerUnit: number;
  unit?: string | null;
  currency?: string | null;

  minimumCharge?: number | null;
  fixedCharge?: number | null;

  effectiveFromUtc?: string | null;
  effectiveToUtc?: string | null;

  isActive?: boolean;
  isDeleted?: boolean;

  notes?: string | null;

  createdAtUtc?: string | null;
  updatedAtUtc?: string | null;
}

export interface UtilityRateQuery {
  pageNumber?: number;
  pageSize?: number;

  search?: string;
  utilityId?: string;
  utilityType?: string;
  isActive?: boolean;

  sortBy?: UtilityRateSortField;
  sortDirection?: SortDirection;
}

export type UtilityRateSortField =
  | 'name'
  | 'code'
  | 'utilityName'
  | 'ratePerUnit'
  | 'effectiveFromUtc'
  | 'effectiveToUtc';

export type SortDirection =
  | 'asc'
  | 'desc';

export interface UtilityRatePagedResult {
  items: UtilityRate[];

  pageNumber: number;
  pageSize: number;

  totalCount: number;
  totalPages: number;

  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface UtilityRateUpsertRequest {
  utilityId: string;

  name?: string | null;
  code?: string | null;

  ratePerUnit: number;
  unit?: string | null;
  currency?: string | null;

  minimumCharge?: number | null;
  fixedCharge?: number | null;

  effectiveFromUtc?: string | null;
  effectiveToUtc?: string | null;

  isActive: boolean;

  notes?: string | null;
}

export interface UtilityRateActiveRequest {
  isActive: boolean;
}
