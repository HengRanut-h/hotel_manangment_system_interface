import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const roomInspectionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/room-inspection-list/room-inspection-list.page'
      ).then(
        module =>
          module.RoomInspectionListPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'room-inspections.view'
    }
  }
];
