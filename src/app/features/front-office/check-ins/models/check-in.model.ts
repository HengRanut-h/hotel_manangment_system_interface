export interface CheckInReservation {
  id: string;
  reservationNumber: string;
  guestId: string;
  guestName: string;
  roomTypeId: string;
  roomTypeName: string;
  roomId: string | null;
  roomNumber: string | null;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  nightlyRate: number;
  totalAmount: number;
  nights: number;
  status: string;
  createdAtUtc: string;
}

export interface CheckInReservationList {
  items: CheckInReservation[];
  totalItems?: number;
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface ApiResponse<T> {
  success?: boolean;
  status?: number;
  code?: string | null;
  message?: string;
  data?: T;
  errors?: Record<string, string[]> | null;
  traceId?: string | null;
}
