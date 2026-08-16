export interface Guest {
  id: string;
  hotelId: string;
  userId: string | null;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  isVip: boolean;
  createdAtUtc: string;
}

export interface GuestRequest {
  firstName: string;
  lastName: string;
  phone?: string | null;
  email?: string | null;
  isVip: boolean;
}

export interface GuestListPayload {
  items: Guest[];
  pageNumber?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  code?: string | null;
  errors?: Record<string, string[]> | null;
  traceId?: string | null;
}
