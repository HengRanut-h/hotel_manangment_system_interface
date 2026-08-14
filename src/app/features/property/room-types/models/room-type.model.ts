export interface RoomType {
  id: string;
  name: string;
  code: string;
  baseRate: number;
  maxAdults: number;
  maxChildren: number;
  description: string | null;
  isActive: boolean;
}

export interface RoomTypeQuery {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateRoomTypeRequest {
  name: string;
  code: string;
  baseRate: number;
  maxAdults: number;
  maxChildren: number;
  description?: string | null;
  isActive: boolean;
}

export interface UpdateRoomTypeRequest {
  name: string;
  code: string;
  baseRate: number;
  maxAdults: number;
  maxChildren: number;
  description?: string | null;
  isActive: boolean;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
