export interface UtilityRate {
  id: string;
  hotelId?: string | null;

  utilityId: string;
  utilityName?: string | null;

  name?: string | null;

  ratePerUnit: number;
  currency?: string | null;

  effectiveFromUtc?: string | null;
  effectiveToUtc?: string | null;

  isActive?: boolean;
  isDeleted?: boolean;

  createdAtUtc?: string | null;
  updatedAtUtc?: string | null;
}

export interface UtilityRateQuery {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  utilityId?: string;
  isActive?: boolean;
}

export interface UtilityRateRequest {
  utilityId: string;
  name?: string | null;
  ratePerUnit: number;
  currency?: string | null;
  effectiveFromUtc?: string | null;
  effectiveToUtc?: string | null;
  isActive: boolean;
}
