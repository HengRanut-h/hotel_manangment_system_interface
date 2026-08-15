export interface StockTransaction {
  id: string;
  hotelId: string;
  branchId: string | null;
  referenceNumber: string;
  title: string;
  status: string;
  notes: string | null;
  amount: number | null;
  eventAtUtc: string | null;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
  createdAtUtc: string;
}

export interface StockTransactionQuery {
  search?: string;
  status?: string;
  relatedEntityType?: string;
  from?: string;
  to?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateStockTransactionRequest {
  branchId?: string | null;
  referenceNumber: string;
  title: string;
  notes?: string | null;
  amount?: number | null;
  eventAtUtc?: string | null;
  relatedEntityId?: string | null;
  relatedEntityType?: string | null;
}

export interface UpdateStockTransactionRequest {
  branchId?: string | null;
  title: string;
  notes?: string | null;
  amount?: number | null;
  eventAtUtc?: string | null;
  relatedEntityId?: string | null;
  relatedEntityType?: string | null;
}

export interface ChangeStockTransactionStatusRequest {
  status: string;
}

export interface InventoryLookupItem {
  id: string;
  sku: string;
  name: string;
  unit: string;
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
