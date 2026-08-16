// =========================================================
// LOGIN REQUEST
// =========================================================

export interface LoginRequest {
  email: string;
  password: string;
}

// =========================================================
// REGISTER REQUEST
// =========================================================

export interface RegisterRequest {
  fullName: string;
  hotelName: string;
  email: string;
  currency: string;
  password: string;
  confirmPassword: string;
}

// =========================================================
// API RESPONSE
// =========================================================

export interface ApiResponse<T> {
  success: boolean;

  status: number;

  code: string;

  message: string;

  data: T;

  meta?: unknown;

  timestampUtc: string;

  traceId: string;
}

// =========================================================
// AUTH USER
// =========================================================

export interface AuthUser {
  id: string;

  fullName: string;

  email: string;

  hotelId: string | null;

  branchId: string | null;

  roles: string[];

  permissions: string[];
}

export type CurrentUser = AuthUser;

// =========================================================
// AUTH RESPONSE
// =========================================================

export interface AuthResponse {
  accessToken: string;

  accessTokenExpiresAtUtc: string;

  refreshToken: string;

  refreshTokenExpiresAtUtc: string;

  user: AuthUser;
}

// =========================================================
// REFRESH TOKEN REQUEST
// =========================================================

export interface RefreshTokenRequest {
  refreshToken: string;
}
