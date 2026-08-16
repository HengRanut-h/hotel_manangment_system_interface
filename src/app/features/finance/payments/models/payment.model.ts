export interface Payment {
  id: string;
  hotelId?: string | null;

  paymentNumber?: string | null;

  invoiceId?: string | null;
  invoiceNumber?: string | null;

  reservationId?: string | null;
  reservationNumber?: string | null;

  guestId?: string | null;
  guestName?: string | null;

  amount: number;
  currency?: string | null;

  method?: PaymentMethod | string | null;
  status?: PaymentStatus | string | null;

  referenceNumber?: string | null;
  transactionId?: string | null;

  notes?: string | null;

  paidAtUtc?: string | null;
  createdAtUtc?: string | null;
  updatedAtUtc?: string | null;
}

export type PaymentMethod =
  | 'Cash'
  | 'Card'
  | 'BankTransfer'
  | 'MobilePayment'
  | 'Cheque'
  | 'Online'
  | 'Other';

export type PaymentStatus =
  | 'Pending'
  | 'Completed'
  | 'Failed'
  | 'Cancelled'
  | 'Refunded';

export type PaymentSortField =
  | 'paymentNumber'
  | 'amount'
  | 'method'
  | 'status'
  | 'referenceNumber'
  | 'paidAtUtc';

export type SortDirection =
  | 'asc'
  | 'desc';

export interface PaymentQuery {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  method?: string;
  sortBy?: PaymentSortField;
  sortDirection?: SortDirection;
}

export interface PaymentPagedResult {
  items: Payment[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}
