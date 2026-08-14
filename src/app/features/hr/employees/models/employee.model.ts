export interface Employee {
  id: string;
  hotelId: string;
  branchId: string | null;
  employeeNumber: string;
  fullName: string;
  email: string | null;
  departmentId: string | null;
  positionId: string | null;
  isActive: boolean;
  createdAtUtc: string;
}

export interface EmployeeQuery {
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  sortBy?: 'fullName' | 'employeeNumber' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateEmployeeRequest {
  employeeNumber: string;
  fullName: string;
  email?: string | null;
  departmentId?: string | null;
  positionId?: string | null;
  branchId?: string | null;
}

export interface UpdateEmployeeRequest {
  employeeNumber: string;
  fullName: string;
  email?: string | null;
  departmentId?: string | null;
  positionId?: string | null;
  branchId?: string | null;
}

export interface EmployeeLookupOption {
  id: string;
  name: string;
  code: string;
  isActive?: boolean;
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
