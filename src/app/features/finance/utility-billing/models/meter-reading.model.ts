export interface MeterReading {
  id: string;
  hotelId?: string | null;

  meterId: string;
  meterNumber?: string | null;

  utilityId?: string | null;
  utilityName?: string | null;

  roomId?: string | null;
  roomNumber?: string | null;

  previousReading?: number | null;
  currentReading: number;

  usage?: number | null;

  ratePerUnit?: number | null;
  amount?: number | null;
  currency?: string | null;

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
  fromUtc?: string;
  toUtc?: string;
}

export interface MeterReadingRequest {
  meterId: string;
  currentReading: number;
  readingDateUtc: string;
  notes?: string | null;
}
