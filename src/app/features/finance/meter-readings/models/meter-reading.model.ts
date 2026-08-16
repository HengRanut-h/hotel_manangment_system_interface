export interface MeterReading {
  id: string;

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

  createdAtUtc?: string | null;
}

export interface CreateMeterReadingRequest {
  meterId: string;
  currentReading: number;
  readingDateUtc: string;
  notes?: string | null;
}
