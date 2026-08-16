export interface MeterReading {
  id: string;
  hotelId?: string | null;

  meterId: string;
  meterNumber?: string | null;

  utilityId?: string | null;
  utilityName?: string | null;
  utilityType?: string | null;

  roomId?: string | null;
  roomNumber?: string | null;

  previousReading?: number | null;
  currentReading: number;
  usage?: number | null;

  ratePerUnit?: number | null;
  amount?: number | null;
  currency?: string | null;
  unit?: string | null;

  readingDateUtc: string;

  notes?: string | null;

  isDeleted?: boolean;

  createdAtUtc?: string | null;
  updatedAtUtc?: string | null;
}

export interface MeterReadingQuery {
  pageNumber?: number;
  pageSize?: number;

  search?: string;

  meterId?: string;
  utilityId?: string;
  utilityType?: string;
  roomId?: string;

  fromUtc?: string;
  toUtc?: string;

  sortBy?: MeterReadingSortField;
  sortDirection?: SortDirection;
}

export type MeterReadingSortField =
  | 'meterNumber'
  | 'utilityName'
  | 'roomNumber'
  | 'currentReading'
  | 'usage'
  | 'amount'
  | 'readingDateUtc';

export type SortDirection =
  | 'asc'
  | 'desc';

export interface MeterReadingPagedResult {
  items: MeterReading[];

  pageNumber: number;
  pageSize: number;

  totalCount: number;
  totalPages: number;

  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface MeterReadingUpsertRequest {
  meterId: string;
  currentReading: number;
  readingDateUtc: string;
  notes?: string | null;
}
