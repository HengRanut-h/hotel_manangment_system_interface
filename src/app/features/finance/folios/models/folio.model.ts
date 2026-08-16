export interface FolioCharge {
  id: string;
  folioId: string | null;
  category: string;
  description: string;
  amount: number;
  isVoided: boolean;
  createdAtUtc: string | null;
}

export interface Folio {
  id: string;
  hotelId: string | null;
  branchId: string | null;
  reservationId: string;
  guestId: string;
  folioNumber: string;
  isClosed: boolean;
  createdAtUtc: string | null;
  charges: FolioCharge[];
}

export interface CreateFolioRequest {
  reservationId: string;

  /**
   * Compatibility field:
   * the persisted Folio has GuestId, but the exact FolioRequest source
   * was not available in the retrieved project material.
   * ASP.NET Core normally ignores unknown JSON properties.
   */
  guestId?: string | null;
}

export interface AddFolioChargeRequest {
  category: string;
  description: string;
  amount: number;
}

export interface ReservationLookup {
  id: string;
  reservationNumber: string;
  guestId: string;
  guestName: string;
  roomNumber: string | null;
  roomTypeName: string;
  checkInDate: string;
  checkOutDate: string;
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
