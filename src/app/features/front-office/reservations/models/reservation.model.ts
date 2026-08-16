export interface Reservation {
  id: string;
  hotelId: string;
  branchId: string | null;
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

export interface CreateReservationRequest {
  guestId: string;
  roomTypeId: string;
  roomId?: string | null;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  nightlyRate: number;
}

export interface GuestLookup {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
}

export interface RoomTypeLookup {
  id: string;
  name: string;
  code: string | null;
  baseRate: number;
}

export interface RoomLookup {
  id: string;
  roomNumber: string;
  roomTypeId: string;
  roomTypeName: string;
  status: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
  code?: string | null;
  errors?: Record<string, string[]> | null;
  traceId?: string | null;
}

export interface ReservationListPayload {
  items: Reservation[];
  pageNumber?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
}
