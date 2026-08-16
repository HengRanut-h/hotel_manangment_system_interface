export type FeatureFlagEnvironment =
  | 'All'
  | 'Development'
  | 'Staging'
  | 'Production'
  | 'Testing';

export type SortDirection =
  | 'asc'
  | 'desc';

export type FeatureFlagSortField =
  | 'name'
  | 'key'
  | 'environment'
  | 'rolloutPercentage'
  | 'isEnabled'
  | 'createdAtUtc';

export interface FeatureFlag {
  id: string;

  hotelId?: string | null;

  key: string;
  name: string;

  description?: string | null;

  environment?: FeatureFlagEnvironment | string | null;

  isEnabled: boolean;

  rolloutPercentage?: number | null;

  startsAtUtc?: string | null;
  endsAtUtc?: string | null;

  conditionsJson?: string | null;
  metadataJson?: string | null;

  isDeleted?: boolean;

  createdAtUtc?: string | null;
  updatedAtUtc?: string | null;
}

export interface FeatureFlagQuery {
  pageNumber?: number;
  pageSize?: number;

  search?: string;

  environment?: string;
  isEnabled?: boolean;
  includeDeleted?: boolean;

  sortBy?: FeatureFlagSortField;
  sortDirection?: SortDirection;
}

export interface FeatureFlagPagedResult {
  items: FeatureFlag[];

  pageNumber: number;
  pageSize: number;

  totalCount: number;
  totalPages: number;

  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface FeatureFlagUpsertRequest {
  key: string;
  name: string;

  description?: string | null;

  environment?: string | null;

  isEnabled: boolean;

  rolloutPercentage: number;

  startsAtUtc?: string | null;
  endsAtUtc?: string | null;

  conditionsJson?: string | null;
  metadataJson?: string | null;
}

export interface FeatureFlagActiveRequest {
  isEnabled: boolean;
}
