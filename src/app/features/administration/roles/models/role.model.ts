export interface Role {
  id: string;
  name: string;
  permissions: string[];
  userCount: number;
}

export interface RoleRequest {
  name: string;
}

export interface SetRolePermissionsRequest {
  permissions: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]> | null;
  traceId?: string | null;
}
