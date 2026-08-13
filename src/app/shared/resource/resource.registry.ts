import { ResourceConfig, ResourceField } from './resource.models';

const catalogFields: ResourceField[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    table: true
  },
  {
    key: 'code',
    label: 'Code',
    type: 'text',
    required: true,
    table: true
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    table: true
  },
  {
    key: 'isActive',
    label: 'Active',
    type: 'boolean',
    table: true
  }
];

const operationalFields: ResourceField[] = [
  {
    key: 'referenceNumber',
    label: 'Reference',
    type: 'text',
    table: true,
    editable: false
  },
  {
    key: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    table: true
  },
  {
    key: 'status',
    label: 'Status',
    type: 'text',
    table: true
  },
  {
    key: 'amount',
    label: 'Amount',
    type: 'number',
    table: true
  },
  {
    key: 'eventAtUtc',
    label: 'Event',
    type: 'datetime',
    table: true
  },
  {
    key: 'notes',
    label: 'Notes',
    type: 'textarea'
  }
];

const defaultStatusOptions = [
  'Open',
  'Pending',
  'Approved',
  'Rejected',
  'InProgress',
  'Completed',
  'Cancelled'
];

const catalog = (
  key: string,
  title: string,
  endpoint: string,
  permission?: string
): ResourceConfig => ({
  key,
  title,
  singular: title.replace(/s$/, ''),
  endpoint,
  permission,
  kind: 'catalog',
  fields: catalogFields,
  canCreate: true,
  canEdit: true,
  canDelete: true,
  canView: true,
  canExport: true,
  supportsActive: true,
  supportsRestore: true
});

const operational = (
  key: string,
  title: string,
  endpoint: string,
  permission?: string
): ResourceConfig => ({
  key,
  title,
  singular: title.replace(/s$/, ''),
  endpoint,
  permission,
  kind: 'operational',
  fields: operationalFields,
  canCreate: true,
  canEdit: true,
  canDelete: true,
  canView: true,
  canExport: true,
  supportsStatus: true,
  statusOptions: defaultStatusOptions
});

export const RESOURCE_REGISTRY: Record<string, ResourceConfig> = {
  hotels: {
    ...catalog('hotels', 'Hotels', 'hotels', 'hotels.view'),
    fields: [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        table: true
      },
      {
        key: 'code',
        label: 'Code',
        type: 'text',
        required: true,
        table: true
      },
      {
        key: 'currency',
        label: 'Currency',
        type: 'text',
        required: true,
        table: true
      },
      {
        key: 'isActive',
        label: 'Active',
        type: 'boolean',
        table: true
      }
    ],
    supportsRestore: false
  },

  branches: catalog('branches', 'Branches', 'branches', 'branches.view'),
  buildings: catalog('buildings', 'Buildings', 'buildings', 'buildings.view'),
  floors: catalog('floors', 'Floors', 'floors', 'floors.view'),
  amenities: catalog('amenities', 'Amenities', 'amenities', 'amenities.view'),
  rates: catalog('rates', 'Rates', 'rates', 'rates.view'),

  deposits: operational('deposits', 'Deposits', 'deposits', 'deposits.view'),
  refunds: operational('refunds', 'Refunds', 'refunds', 'refunds.view'),
  taxes: catalog('taxes', 'Taxes', 'taxes', 'taxes.view'),
  discounts: catalog('discounts', 'Discounts', 'discounts', 'discounts.view'),
  'utility-rates': catalog(
    'utility-rates',
    'Utility Rates',
    'utility-rates',
    'utility-rates.view'
  ),

  'room-inspections': operational(
    'room-inspections',
    'Room Inspections',
    'room-inspections',
    'room-inspections.view'
  ),
  services: catalog('services', 'Guest Services', 'services', 'services.view'),
  'guest-requests': operational(
    'guest-requests',
    'Guest Requests',
    'guest-requests',
    'guest-requests.view'
  ),
  complaints: operational(
    'complaints',
    'Complaints',
    'complaints',
    'complaints.view'
  ),
  'lost-and-found': operational(
    'lost-and-found',
    'Lost & Found',
    'lost-and-found',
    'lost-and-found.view'
  ),
  laundry: operational('laundry', 'Laundry', 'laundry', 'laundry.view'),
  transportation: operational(
    'transportation',
    'Transportation',
    'transportation',
    'transportation.view'
  ),
  'security-incidents': operational(
    'security-incidents',
    'Security Incidents',
    'security-incidents',
    'security-incidents.view'
  ),

  warehouses: catalog(
    'warehouses',
    'Warehouses',
    'warehouses',
    'warehouses.view'
  ),
  'stock-transactions': operational(
    'stock-transactions',
    'Stock Transactions',
    'stock-transactions',
    'stock-transactions.view'
  ),
  suppliers: catalog('suppliers', 'Suppliers', 'suppliers', 'suppliers.view'),
  'purchase-requests': operational(
    'purchase-requests',
    'Purchase Requests',
    'purchase-requests',
    'purchase-requests.view'
  ),
  'purchase-orders': operational(
    'purchase-orders',
    'Purchase Orders',
    'purchase-orders',
    'purchase-orders.view'
  ),
  'goods-receipts': operational(
    'goods-receipts',
    'Goods Receipts',
    'goods-receipts',
    'goods-receipts.view'
  ),

  departments: catalog(
    'departments',
    'Departments',
    'departments',
    'departments.view'
  ),
  positions: catalog('positions', 'Positions', 'positions', 'positions.view'),
  shifts: catalog('shifts', 'Shifts', 'shifts', 'shifts.view'),
  attendance: operational(
    'attendance',
    'Attendance',
    'attendance',
    'attendance.view'
  ),
  'leave-requests': operational(
    'leave-requests',
    'Leave Requests',
    'leave-requests',
    'leave-requests.view'
  ),

  'feature-flags': catalog(
    'feature-flags',
    'Feature Flags',
    'feature-flags',
    'feature-flags.view'
  ),
  settings: catalog('settings', 'Settings', 'settings', 'settings.view'),
  'room-assignments': operational(
    'room-assignments',
    'Room Assignments',
    'room-assignments',
    'room-assignments.view'
  ),
  'room-changes': operational(
    'room-changes',
    'Room Changes',
    'room-changes',
    'room-changes.view'
  ),
  'stay-extensions': operational(
    'stay-extensions',
    'Stay Extensions',
    'stay-extensions',
    'stay-extensions.view'
  )
};
