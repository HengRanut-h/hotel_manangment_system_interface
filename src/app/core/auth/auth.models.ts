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
// CURRENT USER
// =========================================================

export interface CurrentUser {
  id: string;

  fullName: string;

  email: string;

  hotelId: string | null;

  branchId: string | null;

  roles: string[];

  permissions: string[];
}

// =========================================================
// AUTH RESPONSE
// =========================================================

export interface AuthResponse {
  accessToken: string;

  accessTokenExpiresAtUtc: string;

  refreshToken: string;

  refreshTokenExpiresAtUtc: string;

  user: CurrentUser;
}
