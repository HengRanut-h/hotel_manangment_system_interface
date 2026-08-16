export interface UtilityMeter {
  id: string;
  hotelId?: string | null;

  meterNumber: string;

  utilityId: string;
  utilityName?: string | null;
  utilityType?: string | null;
  unit?: string | null;

  roomId?: string | null;
  roomNumber?: string | null;

  buildingId?: string | null;
  buildingName?: string | null;

  floorId?: string | null;
  floorName?: string | null;

  location?: string | null;

  initialReading?: number | null;
  currentReading?: number | null;

  installedAtUtc?: string | null;
  lastReadingAtUtc?: string | null;

  isActive?: boolean;
  isDeleted?: boolean;

  notes?: string | null;

  createdAtUtc?: string | null;
  updatedAtUtc?: string | null;
}

export interface UtilityMeterQuery {
  pageNumber?: number;
  pageSize?: number;

  search?: string;
  utilityId?: string;
  utilityType?: string;
  isActive?: boolean;

  sortBy?: UtilityMeterSortField;
  sortDirection?: SortDirection;
}

export type UtilityMeterSortField =
  | 'meterNumber'
  | 'utilityName'
  | 'roomNumber'
  | 'currentReading'
  | 'installedAtUtc'
  | 'lastReadingAtUtc';

export type SortDirection =
  | 'asc'
  | 'desc';

export interface UtilityMeterPagedResult {
  items: UtilityMeter[];

  pageNumber: number;
  pageSize: number;

  totalCount: number;
  totalPages: number;

  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface UtilityMeterUpsertRequest {
  meterNumber: string;

  utilityId: string;

  roomId?: string | null;
  buildingId?: string | null;
  floorId?: string | null;

  location?: string | null;

  initialReading?: number | null;

  installedAtUtc?: string | null;

  isActive: boolean;

  notes?: string | null;
}

export interface UtilityMeterActiveRequest {
  isActive: boolean;
}
