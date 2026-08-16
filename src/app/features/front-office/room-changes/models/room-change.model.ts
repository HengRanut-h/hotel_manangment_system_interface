export interface RoomChange {
  id: string;
  hotelId?: string | null;

  reservationId?: string | null;
  reservationNumber?: string | null;

  guestId?: string | null;
  guestName?: string | null;

  fromRoomId?: string | null;
  fromRoomNumber?: string | null;
  fromRoomTypeName?: string | null;

  toRoomId?: string | null;
  toRoomNumber?: string | null;
  toRoomTypeName?: string | null;

  reason?: string | null;
  notes?: string | null;

  status?: RoomChangeStatus | string;

  requestedAtUtc?: string | null;
  changedAtUtc?: string | null;

  createdAtUtc?: string | null;
  updatedAtUtc?: string | null;
}

export type RoomChangeStatus =
  | 'Pending'
  | 'Approved'
  | 'Completed'
  | 'Rejected'
  | 'Cancelled';

export type RoomChangeSortField =
  | 'requestedAtUtc'
  | 'changedAtUtc'
  | 'guestName'
  | 'reservationNumber'
  | 'fromRoomNumber'
  | 'toRoomNumber'
  | 'status';

export type SortDirection =
  | 'asc'
  | 'desc';

export interface RoomChangeQuery {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sortBy?: RoomChangeSortField;
  sortDirection?: SortDirection;
}

export interface RoomChangePagedResult {
  items: RoomChange[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}
