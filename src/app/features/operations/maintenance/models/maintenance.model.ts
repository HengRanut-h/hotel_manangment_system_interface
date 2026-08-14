export type MaintenanceStatus =
  | 'Open'
  | 'Assigned'
  | 'InProgress'
  | 'OnHold'
  | 'Completed'
  | 'Cancelled';

export const maintenanceStatuses: MaintenanceStatus[] = [
  'Open',
  'Assigned',
  'InProgress',
  'OnHold',
  'Completed',
  'Cancelled'
];

export interface MaintenanceRequest {
  id: string;
  roomId: string | null;
  roomNumber: string | null;
  category: string;
  description: string;
  priority: string;
  status: MaintenanceStatus | string;
  assignedUserId: string | null;
  createdAtUtc: string;
}

export interface CreateMaintenanceRequest {
  roomId: string | null;
  category: string;
  description: string;
  priority: string;
}
