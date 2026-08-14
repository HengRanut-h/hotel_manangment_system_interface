export type RoomStatus =
  | 'Available'
  | 'Reserved'
  | 'Occupied'
  | 'Dirty'
  | 'Cleaning'
  | 'Inspected'
  | 'Maintenance'
  | 'OutOfOrder'
  | 'Blocked';

export const roomStatuses: RoomStatus[] = [
  'Available',
  'Reserved',
  'Occupied',
  'Dirty',
  'Cleaning',
  'Inspected',
  'Maintenance',
  'OutOfOrder',
  'Blocked'
];

export interface Room {
  id: string;
  hotelId: string;
  branchId: string;
  roomTypeId: string;
  roomTypeName: string;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
}

export interface RoomQuery {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateRoomRequest {
  branchId?: string | null;
  roomTypeId: string;
  roomNumber: string;
  floor: number;
}

export interface UpdateRoomRequest {
  roomTypeId: string;
  roomNumber: string;
  floor: number;
}

export interface ChangeRoomStatusRequest {
  status: RoomStatus;
}

export interface RoomOption {
  id: string;
  name: string;
  code?: string;
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
