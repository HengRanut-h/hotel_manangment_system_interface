export type UtilityType =
  | 'Electricity'
  | 'Water'
  | 'Gas'
  | 'Internet'
  | 'Other';

export interface Utility {
  id: string;
  hotelId?: string | null;

  name: string;
  code?: string | null;

  type?: UtilityType | string | null;
  unit?: string | null;

  description?: string | null;

  isActive?: boolean;
  isDeleted?: boolean;

  createdAtUtc?: string | null;
  updatedAtUtc?: string | null;
}

export interface UtilityQuery {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  type?: string;
  isActive?: boolean;
}

export interface UtilityRequest {
  name: string;
  code?: string | null;
  type: UtilityType | string;
  unit: string;
  description?: string | null;
  isActive: boolean;
}
