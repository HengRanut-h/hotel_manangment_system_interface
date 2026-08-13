export interface User {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  hotelId: string | null;
  branchId: string | null;
  roles: string[];
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  roleNames: string[];
  branchId?: string | null;
}

export interface UpdateUserRequest {
  fullName: string;
  email: string;
  branchId?: string | null;
  isActive: boolean;
  roleNames: string[];
}

export interface ResetUserPasswordRequest {
  password: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
  code?: string | null;
  errors?: Record<string, string[]> | null;
  traceId?: string | null;
}
