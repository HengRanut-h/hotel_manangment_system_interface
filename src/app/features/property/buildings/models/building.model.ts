export interface Building {
  id: string;
  hotelId: string;
  branchId: string | null;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  createdAtUtc: string;
}

export interface BuildingQuery {
  search?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'code' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateBuildingRequest {
  name: string;
  code: string;
  description?: string | null;
  branchId?: string | null;
}

export interface UpdateBuildingRequest {
  name: string;
  code: string;
  description?: string | null;
  isActive: boolean;
}

export interface BuildingBranchOption {
  id: string;
  name: string;
  code: string;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
