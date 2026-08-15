export interface GuestService {
  id: string;
  hotelId: string;
  branchId: string | null;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  createdAtUtc: string;
}

export interface GuestServiceQuery {
  search?: string;
  isActive?: boolean | null;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateGuestServiceRequest {
  branchId?: string | null;
  name: string;
  code: string;
  description?: string | null;
}

export interface UpdateGuestServiceRequest {
  branchId?: string | null;
  name: string;
  code: string;
  description?: string | null;
  isActive: boolean;
}

export interface GuestServicePagedResult {
  items: GuestService[];
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
