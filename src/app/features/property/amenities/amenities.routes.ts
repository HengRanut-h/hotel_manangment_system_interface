import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const amenityRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/amenity-list/amenity-list.page'
      ).then(
        module =>
          module.AmenityListPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'amenities.view'
    }
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        './pages/amenity-create/amenity-create.page'
      ).then(
        module =>
          module.AmenityCreatePage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'amenities.create'
    }
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import(
        './pages/amenity-edit/amenity-edit.page'
      ).then(
        module =>
          module.AmenityEditPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'amenities.update'
    }
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './pages/amenity-detail/amenity-detail.page'
      ).then(
        module =>
          module.AmenityDetailPage
      ),
    canActivate: [
      permissionGuard
    ],
    data: {
      permission: 'amenities.view'
    }
  }
];
