import {
  PaginationMeta
} from '../../../../core/http/api-response.models';

export type RoomInspectionStatus =
  | 'Open'
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled';

export const roomInspectionStatuses: RoomInspectionStatus[] = [
  'Open',
  'Pending',
  'Approved',
  'Rejected',
  'InProgress',
  'Completed',
  'Cancelled'
];

export interface RoomInspection {
  id: string;
  hotelId: string;
  branchId: string | null;
  referenceNumber: string;
  title: string;
  status: RoomInspectionStatus | string;
  notes: string | null;
  amount: number;
  eventAtUtc: string;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
  createdAtUtc: string;
}

export interface RoomInspectionListRequest {
  pageNumber: number;
  pageSize: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface RoomInspectionCreateRequest {
  title: string;
  notes: string | null;
  amount: number;
  eventAtUtc: string;
  status: string;
}

export interface RoomInspectionUpdateRequest {
  title: string;
  notes: string | null;
  amount: number;
  eventAtUtc: string;
}

export interface RoomInspectionListResponse {
  items: RoomInspection[];
  pagination: PaginationMeta;
}
