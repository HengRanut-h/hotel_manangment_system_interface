export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'select';

export interface ResourceFieldOption {
  label: string;
  value: string;
}

export interface ResourceField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  table?: boolean;
  editable?: boolean;
  options?: ResourceFieldOption[];
}

export interface ResourceConfig {
  key: string;
  title: string;
  singular: string;
  endpoint: string;
  permission?: string;
  kind: 'catalog' | 'operational';
  fields: ResourceField[];

  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canView?: boolean;
  canExport?: boolean;

  supportsStatus?: boolean;
  supportsActive?: boolean;
  supportsRestore?: boolean;

  statusOptions?: string[];
}

export type ResourceRow = Record<string, unknown> & {
  id?: string;
  status?: string;
  isActive?: boolean;
  isDeleted?: boolean;
};
