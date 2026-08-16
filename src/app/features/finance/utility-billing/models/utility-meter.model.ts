export interface UtilityMeter {
  id: string;
  hotelId?: string | null;

  utilityId: string;
  utilityName?: string | null;

  meterNumber: string;

  roomId?: string | null;
  roomNumber?: string | null;

  location?: string | null;

  initialReading?: number | null;
  currentReading?: number | null;

  installedAtUtc?: string | null;

  isActive?: boolean;
  isDeleted?: boolean;

  createdAtUtc?: string | null;
  updatedAtUtc?: string | null;
}

export interface UtilityMeterQuery {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  utilityId?: string;
  isActive?: boolean;
}

export interface UtilityMeterRequest {
  utilityId: string;
  meterNumber: string;
  roomId?: string | null;
  location?: string | null;
  initialReading?: number | null;
  installedAtUtc?: string | null;
  isActive: boolean;
}
