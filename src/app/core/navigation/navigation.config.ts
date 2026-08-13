export type NavIcon='dashboard'|'calendar'|'users'|'room'|'hotel'|'money'|'document'|'gauge'|'sparkles'|'settings'|'bell'|'flag'|'search'|'restaurant'|'boxes'|'shopping'|'user-cog'|'shield'|'chart'|'refresh'|'clock'|'check';
export interface NavItem { label:string; path:string; icon:NavIcon; permission?:string; keywords?:string; }
export interface NavGroup { label:string; items:NavItem[]; }
const item=(label:string,path:string,icon:NavIcon,permission?:string,keywords?:string):NavItem=>({label,path,icon,permission,keywords});
export const APP_NAVIGATION:NavGroup[]=[
 {label:'Overview',items:[item('Dashboard','/app/dashboard','dashboard','dashboard.view','analytics kpi revenue occupancy')]},
 {label:'Front Office',items:[
   item('Availability','/app/front-office/availability','calendar','availability.view'), item('Reservations','/app/front-office/reservations','calendar','reservations.view'), item('Check-ins','/app/front-office/check-ins','check','reservations.check-in'), item('Check-outs','/app/front-office/check-outs','check','reservations.check-out'), item('Guests','/app/front-office/guests','users','guests.view'), item('Room Assignments','/app/front-office/room-assignments','room','room-assignments.view'), item('Room Changes','/app/front-office/room-changes','refresh','room-changes.view'), item('Stay Extensions','/app/front-office/stay-extensions','clock','stay-extensions.view')
 ]},
 {label:'Property',items:[
   item('Hotels','/app/property/hotels','hotel','hotels.view'), item('Branches','/app/property/branches','hotel','branches.view'), item('Buildings','/app/property/buildings','hotel','buildings.view'), item('Floors','/app/property/floors','hotel','floors.view'), item('Room Types','/app/property/room-types','room','room-types.view'), item('Rooms','/app/property/rooms','room','rooms.view'), item('Amenities','/app/property/amenities','sparkles','amenities.view'), item('Rates','/app/property/rates','money','rates.view')
 ]},
 {label:'Finance',items:[
   item('Folios','/app/finance/folios','document','folios.view'), item('Invoices','/app/finance/invoices','document','invoices.view'), item('Payments','/app/finance/payments','money','payments.view'), item('Deposits','/app/finance/deposits','money','deposits.view'), item('Refunds','/app/finance/refunds','refresh','refunds.view'), item('Taxes','/app/finance/taxes','money','taxes.view'), item('Discounts','/app/finance/discounts','money','discounts.view'), item('Utilities','/app/finance/utilities','gauge','utilities.view'), item('Utility Rates','/app/finance/utility-rates','money','utility-rates.view'), item('Utility Meters','/app/finance/utility-meters','gauge','utilities.view'), item('Meter Readings','/app/finance/meter-readings','gauge','utilities.view')
 ]},
 {label:'Operations',items:[
   item('Housekeeping','/app/operations/housekeeping','sparkles','housekeeping.view'), item('Room Inspections','/app/operations/room-inspections','check','room-inspections.view'), item('Maintenance','/app/operations/maintenance','settings','maintenance.view'), item('Guest Services','/app/operations/services','sparkles','services.view'), item('Guest Requests','/app/operations/guest-requests','bell','guest-requests.view'), item('Complaints','/app/operations/complaints','flag','complaints.view'), item('Lost & Found','/app/operations/lost-and-found','search','lost-and-found.view'), item('Laundry','/app/operations/laundry','refresh','laundry.view'), item('Restaurant / POS','/app/operations/restaurant','restaurant','restaurant.view'), item('Transportation','/app/operations/transportation','refresh','transportation.view'), item('Security Incidents','/app/operations/security-incidents','shield','security-incidents.view')
 ]},
 {label:'Inventory & Purchasing',items:[
   item('Inventory','/app/inventory/items','boxes','inventory.view'), item('Warehouses','/app/inventory/warehouses','boxes','warehouses.view'), item('Stock Transactions','/app/inventory/stock-transactions','refresh','stock-transactions.view'), item('Suppliers','/app/inventory/suppliers','shopping','suppliers.view'), item('Purchase Requests','/app/inventory/purchase-requests','document','purchase-requests.view'), item('Purchase Orders','/app/inventory/purchase-orders','shopping','purchase-orders.view'), item('Goods Receipts','/app/inventory/goods-receipts','check','goods-receipts.view')
 ]},
 {label:'Human Resources',items:[
   item('Employees','/app/hr/employees','users','employees.view'), item('Departments','/app/hr/departments','users','departments.view'), item('Positions','/app/hr/positions','user-cog','positions.view'), item('Shifts','/app/hr/shifts','clock','shifts.view'), item('Attendance','/app/hr/attendance','check','attendance.view'), item('Leave Requests','/app/hr/leave-requests','calendar','leave-requests.view')
 ]},
 {label:'Administration',items:[
   item('Users','/app/admin/users','user-cog','users.manage'), item('Roles','/app/admin/roles','shield','roles.manage'), item('Permissions','/app/admin/permissions','shield','roles.manage'), item('Notifications','/app/admin/notifications','bell'), item('Reports','/app/admin/reports','chart','reports.view'), item('Audit Logs','/app/admin/audit-logs','clock','audit.view'), item('Feature Flags','/app/admin/feature-flags','flag','feature-flags.view'), item('Settings','/app/admin/settings','settings','settings.view')
 ]}
];
