export type ReportCategory =
  | 'FrontOffice'
  | 'Finance'
  | 'Housekeeping'
  | 'Maintenance'
  | 'Inventory'
  | 'Purchasing'
  | 'HumanResources'
  | 'Security'
  | 'Utilities'
  | 'Management'
  | 'Other';

export type ReportFormat =
  | 'Pdf'
  | 'Excel'
  | 'Csv'
  | 'Json';

export type ReportRunStatus =
  | 'Pending'
  | 'Running'
  | 'Completed'
  | 'Failed'
  | 'Cancelled';

export interface ReportDefinition {
  id: string;

  code?: string | null;
  name: string;

  description?: string | null;

  category?: ReportCategory | string | null;

  supportsDateRange?: boolean;
  supportsHotelFilter?: boolean;
  supportsBranchFilter?: boolean;

  defaultFormat?: ReportFormat | string | null;

  isActive?: boolean;

  createdAtUtc?: string | null;
  updatedAtUtc?: string | null;
}

export interface ReportDefinitionQuery {
  pageNumber?: number;
  pageSize?: number;

  search?: string;
  category?: string;
  isActive?: boolean;

  sortBy?: ReportDefinitionSortField;
  sortDirection?: SortDirection;
}

export type ReportDefinitionSortField =
  | 'name'
  | 'code'
  | 'category'
  | 'createdAtUtc';

export type SortDirection =
  | 'asc'
  | 'desc';

export interface ReportDefinitionPagedResult {
  items: ReportDefinition[];

  pageNumber: number;
  pageSize: number;

  totalCount: number;
  totalPages: number;

  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface RunReportRequest {
  reportId: string;

  fromUtc?: string | null;
  toUtc?: string | null;

  hotelId?: string | null;
  branchId?: string | null;

  format?: ReportFormat | string | null;

  filters?: Record<string, string | number | boolean | null>;
}

export interface ReportRun {
  id: string;

  reportId: string;
  reportName?: string | null;
  reportCode?: string | null;
  category?: string | null;

  status?: ReportRunStatus | string | null;
  format?: ReportFormat | string | null;

  fromUtc?: string | null;
  toUtc?: string | null;

  rowCount?: number | null;

  fileName?: string | null;
  fileUrl?: string | null;

  errorMessage?: string | null;

  requestedAtUtc?: string | null;
  startedAtUtc?: string | null;
  completedAtUtc?: string | null;
}

export interface ReportRunQuery {
  pageNumber?: number;
  pageSize?: number;

  search?: string;
  reportId?: string;
  status?: string;
  category?: string;

  fromUtc?: string;
  toUtc?: string;

  sortDirection?: SortDirection;
}

export interface ReportRunPagedResult {
  items: ReportRun[];

  pageNumber: number;
  pageSize: number;

  totalCount: number;
  totalPages: number;
}
