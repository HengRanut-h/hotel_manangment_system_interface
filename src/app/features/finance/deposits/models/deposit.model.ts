export interface Deposit {
  id: string;
  hotelId?: string | null;

  depositNumber?: string | null;

  reservationId?: string | null;
  reservationNumber?: string | null;

  guestId?: string | null;
  guestName?: string | null;

  amount: number;
  currency?: string | null;

  depositType?: DepositType | string | null;
  paymentMethod?: DepositPaymentMethod | string | null;
  status?: DepositStatus | string | null;

  referenceNumber?: string | null;
  transactionId?: string | null;

  notes?: string | null;

  receivedAtUtc?: string | null;
  appliedAtUtc?: string | null;
  refundedAtUtc?: string | null;

  createdAtUtc?: string | null;
  updatedAtUtc?: string | null;
}

export type DepositType =
  | 'Reservation'
  | 'Security'
  | 'Advance'
  | 'Damage'
  | 'Other';

export type DepositPaymentMethod =
  | 'Cash'
  | 'Card'
  | 'BankTransfer'
  | 'MobilePayment'
  | 'Cheque'
  | 'Online'
  | 'Other';

export type DepositStatus =
  | 'Pending'
  | 'Received'
  | 'Applied'
  | 'PartiallyApplied'
  | 'Refunded'
  | 'PartiallyRefunded'
  | 'Cancelled';

export type DepositSortField =
  | 'depositNumber'
  | 'amount'
  | 'depositType'
  | 'paymentMethod'
  | 'status'
  | 'referenceNumber'
  | 'receivedAtUtc';

export type SortDirection =
  | 'asc'
  | 'desc';

export interface DepositQuery {
  pageNumber?: number;
  pageSize?: number;

  search?: string;
  status?: string;
  depositType?: string;
  paymentMethod?: string;

  sortBy?: DepositSortField;
  sortDirection?: SortDirection;
}

export interface DepositPagedResult {
  items: Deposit[];

  pageNumber: number;
  pageSize: number;

  totalCount: number;
  totalPages: number;

  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}
