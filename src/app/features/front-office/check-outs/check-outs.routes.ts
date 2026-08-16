import { Routes } from '@angular/router';
import { permissionGuard } from '../../../core/guards/permission.guard';

export const checkOutsRoutes: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    data: {
      permission: 'check-outs.view'
    },
    loadComponent: () =>
      import(
        './pages/check-outs-list/check-outs-list.page'
      )
        .then(
          module =>
            module.CheckOutsListPage
        )
  }
];
