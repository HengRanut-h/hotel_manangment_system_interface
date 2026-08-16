import {
  ApiEnvelope
} from '../models/paged-result.model';

export function unwrapApi<T>(
  response:
    T | ApiEnvelope<T>
): T {

  if (
    response &&
    typeof response ===
      'object' &&
    'data' in response
  ) {
    return (
      response as
        ApiEnvelope<T>
    ).data;
  }

  return response as T;
}
