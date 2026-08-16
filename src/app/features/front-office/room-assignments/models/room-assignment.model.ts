export interface RoomAssignment {
  id: string;
  hotelId: string;
  branchId: string | null;
  referenceNumber: string;
  title: string;
  status: string;
  notes: string | null;
  amount: number | null;
  eventAtUtc: string | null;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
  createdAtUtc: string;
}

export interface RoomAssignmentQuery {
  search?: string;
  status?: string;
  relatedEntityType?: string;
  from?: string;
  to?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateRoomAssignmentRequest {
  branchId?: string | null;
  referenceNumber: string;
  title: string;
  notes?: string | null;
  amount?: number | null;
  eventAtUtc?: string | null;
  relatedEntityId?: string | null;
  relatedEntityType?: string | null;
}

export interface UpdateRoomAssignmentRequest {
  branchId?: string | null;
  title: string;
  notes?: string | null;
  amount?: number | null;
  eventAtUtc?: string | null;
  relatedEntityId?: string | null;
  relatedEntityType?: string | null;
}

export interface ChangeRoomAssignmentStatusRequest {
  status: string;
}

export interface ReservationLookup {
  id: string;
  reservationNumber: string;
  guestName: string;
  roomNumber: string | null;
  roomTypeName: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
  code?: string | null;
  errors?: Record<string, string[]> | null;
  traceId?: string | null;
}
