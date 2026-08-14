import { Routes } from '@angular/router';

export const hrRoutes: Routes = [
  {
    path: 'employees',
    loadChildren: () =>
      import('./employees/employees.routes')
        .then(m => m.employeeRoutes)
  },
  {
    path: 'departments',
    loadChildren: () =>
      import('./departments/departments.routes')
        .then(m => m.departmentRoutes)
  },
  {
    path: 'positions',
    loadChildren: () =>
      import('./positions/positions.routes')
        .then(m => m.positionRoutes)
  },
  {
    path: 'shifts',
    loadChildren: () =>
      import('./shifts/shifts.routes')
        .then(m => m.shiftRoutes)
  },
  {
    path: 'attendance',
    loadChildren: () =>
      import('./attendance/attendance.routes')
        .then(m => m.attendanceRoutes)
  },
  {
    path: 'leave-requests',
    loadChildren: () =>
      import('./leave-requests/leave-requests.routes')
        .then(m => m.leaveRequestRoutes)
  }
];
