export interface Hotel {
  id: string;

  name: string;

  code: string;

  currency: string;

  isActive: boolean;

  createdAtUtc: string;
}


// =========================================================
// QUERY
// =========================================================

export interface HotelQuery {
  search?: string;

  pageNumber?: number;

  pageSize?: number;
}


// =========================================================
// CREATE
// =========================================================

export interface CreateHotelRequest {
  name: string;

  code: string;

  currency: string;

  isActive?: boolean;
}


// =========================================================
// UPDATE
// =========================================================

export interface UpdateHotelRequest {
  name: string;

  code: string;

  currency: string;

  isActive: boolean;
}


// =========================================================
// PAGINATION
// =========================================================

export interface PaginationMeta {
  pageNumber: number;

  pageSize: number;

  totalItems: number;

  totalPages: number;

  hasPreviousPage: boolean;

  hasNextPage: boolean;
}


// =========================================================
// API META
// =========================================================

export interface ApiMeta {
  pagination?: PaginationMeta;
}


// =========================================================
// API RESPONSE
// =========================================================

export interface ApiResponse<T> {
  success: boolean;

  status?: number;

  code?: string;

  message: string;

  data: T;

  meta?: ApiMeta;

  timestampUtc?: string;

  traceId?: string | null;

  errors?:
    | Record<string, string[]>
    | null;
}


// =========================================================
// PAGED RESULT
// =========================================================

export interface PagedResult<T> {
  items: T[];

  pageNumber: number;

  pageSize: number;

  totalItems: number;

  totalPages: number;

  hasPreviousPage: boolean;

  hasNextPage: boolean;
}
