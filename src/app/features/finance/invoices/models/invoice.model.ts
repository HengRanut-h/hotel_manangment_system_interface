
export interface InvoiceItem {
  id: string;
  invoiceId: string | null;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  hotelId: string | null;
  guestId: string;
  reservationId: string | null;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: string;
  guestName: string;
  createdAtUtc: string | null;
  items: InvoiceItem[];
}

export interface InvoiceCollection {
  items: Invoice[];
  totalItems: number;
}

export interface CreateInvoiceItemRequest {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface CreateInvoiceRequest {
  guestId: string;
  reservationId?: string | null;
  invoiceDate: string;
  dueDate: string;
  discountAmount: number;
  taxAmount: number;
  items: CreateInvoiceItemRequest[];
}

export interface RecordInvoicePaymentRequest {
  amount: number;
  method: string;
  referenceNumber?: string | null;
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
  nightlyRate: number;
  totalAmount: number;
  status: string;
}

export interface InvoiceItemDraft {
  description: string;
  quantity: string;
  unit: string;
  unitPrice: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
  code?: string | null;
  errors?: Record<string, string[]> | null;
  traceId?: string | null;
}
