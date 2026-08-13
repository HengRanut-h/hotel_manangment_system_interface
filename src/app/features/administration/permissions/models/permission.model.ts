export interface Permission {
  id: string;
  name: string;
  createdAtUtc: string;
  createdBy: string | null;
  updatedAtUtc: string | null;
  updatedBy: string | null;
  roleCount: number;
}

export interface CreatePermissionRequest {
  name: string;
}

export interface UpdatePermissionRequest {
  name: string;
}

export interface PermissionQuery {
  search?: string;
  name?: string;
  createdBy?: string;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'createdBy' | 'roleCount';
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
}

export interface PermissionPagedResult {
  items: Permission[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PermissionGroup {
  name: string;
  permissions: Permission[];
}
