import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const inventoryItemsRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'inventory.view'
      },

      loadComponent: () =>
        import(
          './pages/inventory-items-list/inventory-items-list.page'
        )
          .then(
            module =>
              module.InventoryItemsListPage
          )
    },

    {
      path:
        'create',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'inventory.create'
      },

      loadComponent: () =>
        import(
          './pages/inventory-item-create/inventory-item-create.page'
        )
          .then(
            module =>
              module.InventoryItemCreatePage
          )
    }
  ];
