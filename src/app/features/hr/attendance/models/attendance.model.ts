export interface AttendanceRecord {
  id: string;
  hotelId: string;
  branchId: string | null;
  referenceNumber: string;
  title: string;
  status: string;
  notes: string | null;
  amount: number;
  eventAtUtc: string;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
  createdAtUtc: string;
}

export interface AttendanceQuery {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  status?: string | null;
  sortBy?: 'createdAt' | 'reference' | 'title' | 'status' | 'amount' | 'eventAt';
  sortDirection?: 'asc' | 'desc';
}

export interface CreateAttendanceRequest {
  title: string;
  notes?: string | null;
  amount?: number;
  eventAtUtc?: string | null;
  branchId?: string | null;
  relatedEntityId?: string | null;
  relatedEntityType?: string | null;
  status?: string;
}

export interface UpdateAttendanceRequest {
  title: string;
  notes: string | null;
  amount: number;
  eventAtUtc: string;
  relatedEntityId?: string | null;
  relatedEntityType?: string | null;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
