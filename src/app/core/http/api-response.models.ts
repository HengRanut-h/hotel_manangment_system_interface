// =========================================================
// API RESPONSE
// =========================================================

export interface ApiResponse<T> {
  success: boolean;

  status: number;

  code: string;

  message: string;

  data: T;

  meta?: ApiMeta | null;

  timestampUtc?: string;

  traceId?: string | null;
}

// =========================================================
// API ERROR RESPONSE
// =========================================================

export interface ApiErrorResponse {
  success: false;

  status: number;

  code: string;

  message: string;

  errors?: unknown;

  timestampUtc?: string;

  traceId?: string | null;
}

// =========================================================
// API META
// =========================================================

export interface ApiMeta {
  pagination?: PaginationMeta;

  [key: string]: unknown;
}

// =========================================================
// PAGINATION META
// =========================================================

export interface PaginationMeta {
  pageNumber: number;

  pageSize: number;

  totalItems: number;

  totalPages: number;

  hasPreviousPage: boolean;

  hasNextPage: boolean;
}

// =========================================================
// TYPE GUARD - API RESPONSE
// =========================================================

export function isApiResponse<T>(
  value: unknown
): value is ApiResponse<T> {

  if (
    value === null ||
    typeof value !== 'object'
  ) {
    return false;
  }

  const response =
    value as Partial<ApiResponse<T>>;

  return (
    typeof response.success === 'boolean' &&
    typeof response.status === 'number' &&
    typeof response.code === 'string' &&
    typeof response.message === 'string' &&
    'data' in response
  );
}

// =========================================================
// TYPE GUARD - API ERROR RESPONSE
// =========================================================

export function isApiErrorResponse(
  value: unknown
): value is ApiErrorResponse {

  if (
    value === null ||
    typeof value !== 'object'
  ) {
    return false;
  }

  const response =
    value as Partial<ApiErrorResponse>;

  return (
    response.success === false &&
    typeof response.status === 'number' &&
    typeof response.code === 'string' &&
    typeof response.message === 'string'
  );
}

// =========================================================
// UNWRAP API RESPONSE
// =========================================================

export function unwrapApiResponse<T>(
  response: unknown
): T {

  // =======================================================
  // NEW BACKEND RESPONSE FORMAT
  // =======================================================

  if (
    isApiResponse<T>(
      response
    )
  ) {
    return response.data;
  }

  // =======================================================
  // LEGACY / DIRECT RESPONSE SUPPORT
  // =======================================================

  return response as T;
}

// =========================================================
// GET API META
// =========================================================

export function getApiMeta(
  response: unknown
): ApiMeta | null {

  if (
    isApiResponse<unknown>(
      response
    )
  ) {
    return response.meta ?? null;
  }

  return null;
}

// =========================================================
// GET PAGINATION
// =========================================================

export function getPaginationMeta(
  response: unknown
): PaginationMeta | null {

  return (
    getApiMeta(response)
      ?.pagination ??
    null
  );
}

// =========================================================
// GET API MESSAGE
// =========================================================

export function getApiMessage(
  response: unknown,
  fallback = 'Request completed successfully.'
): string {

  if (
    isApiResponse<unknown>(
      response
    )
  ) {
    return response.message;
  }

  return fallback;
}

// =========================================================
// GET API TRACE ID
// =========================================================

export function getApiTraceId(
  response: unknown
): string | null {

  if (
    isApiResponse<unknown>(
      response
    )
  ) {
    return response.traceId ?? null;
  }

  if (
    isApiErrorResponse(
      response
    )
  ) {
    return response.traceId ?? null;
  }

  return null;
}
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  code: string;
  message: string;
  data: T;

  errors?:
    Record<string, string[]> |
    null;

  traceId?:
    string |
    null;
}
