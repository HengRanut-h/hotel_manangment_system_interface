export type HousekeepingStatus =
  | 'Pending'
  | 'Assigned'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled';

export type HousekeepingPriority =
  | 'Low'
  | 'Normal'
  | 'High'
  | 'Urgent';

export const housekeepingStatuses: HousekeepingStatus[] = [
  'Pending',
  'Assigned',
  'InProgress',
  'Completed',
  'Cancelled'
];

export const housekeepingPriorities: HousekeepingPriority[] = [
  'Low',
  'Normal',
  'High',
  'Urgent'
];

export interface HousekeepingTask {
  id: string;
  roomId: string;
  roomNumber: string;
  taskType: string;
  priority: HousekeepingPriority | string;
  status: HousekeepingStatus | string;
  assignedUserId: string | null;
  createdAtUtc: string;
}

export interface CreateHousekeepingTaskRequest {
  roomId: string;
  taskType: string;
  priority: HousekeepingPriority | string;
}

export interface RoomOption {
  id: string;
  roomNumber: string;
}
