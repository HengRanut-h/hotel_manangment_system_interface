export interface Refund {
  id: string;
  hotelId?: string | null;

  refundNumber?: string | null;

  paymentId?: string | null;
  paymentNumber?: string | null;

  invoiceId?: string | null;
  invoiceNumber?: string | null;

  reservationId?: string | null;
  reservationNumber?: string | null;

  guestId?: string | null;
  guestName?: string | null;

  amount: number;
  currency?: string | null;

  reason?: RefundReason | string | null;
  method?: RefundMethod | string | null;
  status?: RefundStatus | string | null;

  referenceNumber?: string | null;
  transactionId?: string | null;

  notes?: string | null;

  requestedAtUtc?: string | null;
  processedAtUtc?: string | null;

  createdAtUtc?: string | null;
  updatedAtUtc?: string | null;
}

export type RefundReason =
  | 'Cancellation'
  | 'Overpayment'
  | 'ServiceIssue'
  | 'DuplicatePayment'
  | 'DepositReturn'
  | 'Other';

export type RefundMethod =
  | 'Cash'
  | 'Card'
  | 'BankTransfer'
  | 'MobilePayment'
  | 'OriginalPaymentMethod'
  | 'Other';

export type RefundStatus =
  | 'Pending'
  | 'Approved'
  | 'Processing'
  | 'Completed'
  | 'Rejected'
  | 'Cancelled';

export type RefundSortField =
  | 'refundNumber'
  | 'amount'
  | 'reason'
  | 'method'
  | 'status'
  | 'referenceNumber'
  | 'requestedAtUtc'
  | 'processedAtUtc';

export type SortDirection =
  | 'asc'
  | 'desc';

export interface RefundQuery {
  pageNumber?: number;
  pageSize?: number;

  search?: string;
  status?: string;
  reason?: string;
  method?: string;

  sortBy?: RefundSortField;
  sortDirection?: SortDirection;
}

export interface RefundPagedResult {
  items: Refund[];

  pageNumber: number;
  pageSize: number;

  totalCount: number;
  totalPages: number;

  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}
