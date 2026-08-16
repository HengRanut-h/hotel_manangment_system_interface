export interface AvailabilityRoom {
  id: string;
  roomNumber: string;
  roomTypeId: string;
  roomTypeName: string;
  baseRate: number;
  status: string;
}

export interface AvailabilityQuery {
  checkInDate: string;
  checkOutDate: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
  code?: string | null;
  errors?: Record<string, string[]> | null;
  traceId?: string | null;
}

export interface AvailabilitySearchSummary {
  roomsFound: number;
  roomTypes: number;
  lowestBaseRate: number | null;
  averageBaseRate: number | null;
}
