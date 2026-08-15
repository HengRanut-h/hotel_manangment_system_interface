export interface Warehouse {
  id: string;
  hotelId: string;
  branchId: string | null;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  createdAtUtc: string;
}

export interface CreateWarehouseRequest {
  branchId?: string | null;
  name: string;
  code: string;
  description?: string | null;
}

export interface UpdateWarehouseRequest {
  branchId?: string | null;
  name: string;
  code: string;
  description?: string | null;
  isActive: boolean;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
  code?: string | null;
  errors?: Record<string, string[]> | null;
  traceId?: string | null;
}
