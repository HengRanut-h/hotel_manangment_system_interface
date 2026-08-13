export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export function normalizePaged<T>(
  value: PagedResult<T> | T[] | null | undefined
): PagedResult<T> {
  if (!value) {
    return {
      items: [],
      pageNumber: 1,
      pageSize: 20,
      totalItems: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false
    };
  }

  if (Array.isArray(value)) {
    return {
      items: value,
      pageNumber: 1,
      pageSize: value.length || 20,
      totalItems: value.length,
      totalPages: value.length > 0 ? 1 : 0,
      hasPreviousPage: false,
      hasNextPage: false
    };
  }

  return {
    ...value,
    items: value.items ?? [],
    pageNumber: value.pageNumber || 1,
    pageSize: value.pageSize || 20,
    totalItems: value.totalItems || 0,
    totalPages: value.totalPages || 0
  };
}
