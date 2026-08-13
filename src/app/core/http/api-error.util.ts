import { HttpErrorResponse } from '@angular/common/http';

interface ApiErrorBody {
  message?: unknown;
  title?: unknown;
  detail?: unknown;
  errors?: Record<string, string[]> | null;
}

/**
 * Converts an HTTP error into a user-safe message.
 * Never returns Angular HttpErrorResponse.message because it may expose URLs.
 */
export function getSafeApiErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  const body = isObject(error.error)
    ? error.error as ApiErrorBody
    : null;

  const serverMessage =
    typeof body?.message === 'string'
      ? body.message.trim()
      : '';

  if (serverMessage && isSafeServerMessage(serverMessage)) {
    return serverMessage;
  }

  switch (error.status) {
    case 0:
      return 'Unable to connect to the server.';
    case 400:
      return 'The request is invalid. Please check the information and try again.';
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested record was not found.';
    case 409:
      return 'The operation conflicts with existing data.';
    case 422:
      return 'Some information is invalid. Please check the form.';
    case 429:
      return 'Too many requests. Please try again later.';
    default:
      return fallback;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSafeServerMessage(message: string): boolean {
  if (message.length === 0 || message.length > 250) {
    return false;
  }

  const unsafePatterns: RegExp[] = [
    /https?:\/\//i,
    /\bwww\./i,
    /\/api(?:\/|\\)/i,
    /\blocalhost\b/i,
    /\b127\.0\.0\.1\b/i,
    /\b0\.0\.0\.0\b/i,
    /:\d{2,5}(?:\/|\b)/,
    /\bstack\s*trace\b/i,
    /\bat\s+[A-Za-z0-9_.<>]+\s*\(/i,
    /\bSystem\.[A-Za-z0-9_.]+Exception\b/i,
    /\bMicrosoft\.[A-Za-z0-9_.]+\b/i,
    /[A-Za-z]:\\[^ \r\n]+/i,
    /\/(?:home|var|usr|etc|opt|srv)\/[^ \r\n]+/i
  ];

  return !unsafePatterns.some(pattern => pattern.test(message));
}
