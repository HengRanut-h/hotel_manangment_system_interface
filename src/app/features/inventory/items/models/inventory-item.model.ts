export interface InventoryItem {
  id: string;
  hotelId: string;
  sku: string;
  name: string;
  unit: string;
  quantityOnHand: number;
  reorderLevel: number;
  createdAtUtc: string;
}

export interface CreateInventoryItemRequest {
  sku: string;
  name: string;
  unit: string;
  quantityOnHand: number;
  reorderLevel: number;
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
