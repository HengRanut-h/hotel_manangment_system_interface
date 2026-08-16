export interface FolioCharge {
  id: string;
  folioId: string;
  category: string;
  description: string;
  amount: number;
  isVoided?: boolean;
  createdAtUtc?: string | null;
}

export interface Folio {
  id: string;
  hotelId?: string | null;
  branchId?: string | null;
  reservationId: string;
  guestId: string;
  folioNumber: string;
  isClosed: boolean;
  createdAtUtc?: string | null;
  charges?: FolioCharge[];
}

export interface CreateFolioRequest {
  reservationId: string;
  guestId: string;
}

export interface AddFolioChargeRequest {
  category: string;
  description: string;
  amount: number;
}
