import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import {
  catchError,
  throwError
} from 'rxjs';

import {
  ApiErrorResponse
} from '../http/api-response.models';

// =========================================================
// LEGACY ASP.NET PROBLEM DETAILS
// =========================================================

interface ProblemDetailsResponse {
  title?: string;
  detail?: string;
  message?: string;
  errors?: unknown;
  traceId?: string;
}

// =========================================================
// NORMALIZED APPLICATION ERROR
// =========================================================

export interface ApplicationHttpError {
  status: number;
  code: string;
  message: string;
  errors?: unknown;
  traceId?: string;
  originalError: HttpErrorResponse;
}

// =========================================================
// ERROR INTERCEPTOR
// =========================================================

export const errorInterceptor: HttpInterceptorFn = (
  request,
  next
) => {
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const response = error.error;

      const applicationError: ApplicationHttpError = {
        status: error.status,
        code: getErrorCode(
          error.status,
          response
        ),
        message: getErrorMessage(
          error,
          response
        ),
        errors: getErrors(response),
        traceId: getTraceId(response),
        originalError: error
      };

      return throwError(
        () => applicationError
      );
    })
  );
};

// =========================================================
// GET ERROR MESSAGE
// =========================================================

function getErrorMessage(
  error: HttpErrorResponse,
  response: unknown
): string {
  // =======================================================
  // NEW API ERROR RESPONSE
  // =======================================================

  if (isApiErrorResponse(response)) {
    return response.message;
  }

  // =======================================================
  // ASP.NET PROBLEM DETAILS / LEGACY RESPONSE
  // =======================================================

  if (isProblemDetailsResponse(response)) {
    return (
      response.detail ??
      response.message ??
      response.title ??
      getDefaultMessage(error.status)
    );
  }

  // =======================================================
  // STRING RESPONSE
  // =======================================================

  if (
    typeof response === 'string' &&
    response.trim().length > 0
  ) {
    return response;
  }

  // =======================================================
  // NETWORK ERROR
  // =======================================================

  if (error.status === 0) {
    return 'Unable to connect to the server. Please check your connection.';
  }

  // =======================================================
  // FALLBACK
  // =======================================================

  return (
    error.message ||
    getDefaultMessage(error.status)
  );
}

// =========================================================
// GET ERROR CODE
// =========================================================

function getErrorCode(
  status: number,
  response: unknown
): string {
  if (isApiErrorResponse(response)) {
    return response.code;
  }

  switch (status) {
    case 0:
      return 'NETWORK_ERROR';

    case 400:
      return 'BAD_REQUEST';

    case 401:
      return 'UNAUTHORIZED';

    case 403:
      return 'FORBIDDEN';

    case 404:
      return 'NOT_FOUND';

    case 409:
      return 'CONFLICT';

    case 422:
      return 'BUSINESS_RULE_VIOLATION';

    case 429:
      return 'RATE_LIMIT_EXCEEDED';

    case 500:
      return 'INTERNAL_SERVER_ERROR';

    default:
      return 'HTTP_ERROR';
  }
}

// =========================================================
// GET VALIDATION / BUSINESS ERRORS
// =========================================================

function getErrors(
  response: unknown
): unknown {
  if (isApiErrorResponse(response)) {
    return response.errors;
  }

  if (isProblemDetailsResponse(response)) {
    return response.errors;
  }

  return undefined;
}

// =========================================================
// GET TRACE ID
// =========================================================

function getTraceId(
  response: unknown
): string | undefined {
  if (isApiErrorResponse(response)) {
    return response.traceId ?? undefined;
  }

  if (isProblemDetailsResponse(response)) {
    return response.traceId;
  }

  return undefined;
}

// =========================================================
// API ERROR RESPONSE TYPE GUARD
// =========================================================

function isApiErrorResponse(
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
    typeof response.success === 'boolean' &&
    response.success === false &&
    typeof response.status === 'number' &&
    typeof response.code === 'string' &&
    typeof response.message === 'string'
  );
}

// =========================================================
// PROBLEM DETAILS TYPE GUARD
// =========================================================

function isProblemDetailsResponse(
  value: unknown
): value is ProblemDetailsResponse {
  if (
    value === null ||
    typeof value !== 'object'
  ) {
    return false;
  }

  const response =
    value as ProblemDetailsResponse;

  return (
    typeof response.detail === 'string' ||
    typeof response.title === 'string' ||
    typeof response.message === 'string' ||
    response.errors !== undefined
  );
}

// =========================================================
// DEFAULT HTTP ERROR MESSAGE
// =========================================================

function getDefaultMessage(
  status: number
): string {
  switch (status) {
    case 0:
      return 'Unable to connect to the server.';

    case 400:
      return 'The request is invalid.';

    case 401:
      return 'Authentication is required.';

    case 403:
      return 'You do not have permission to perform this action.';

    case 404:
      return 'The requested resource was not found.';

    case 409:
      return 'The request conflicts with the current state.';

    case 422:
      return 'The request could not be processed because of a business rule.';

    case 429:
      return 'Too many requests. Please try again later.';

    case 500:
      return 'An unexpected server error occurred.';

    default:
      return 'An unexpected error occurred.';
  }
}
