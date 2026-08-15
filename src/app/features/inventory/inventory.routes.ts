import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const inventoryRoutes: Routes = [

  // =========================================================
  // INVENTORY ITEMS
  // =========================================================

  {
    path: 'items',

    canActivate: [
      permissionGuard
    ],

    data: {
      permission: 'inventory.view'
    },

    loadChildren: () =>
      import(
        './items/inventory-items.routes'
      ).then(
        module =>
          module.inventoryItemsRoutes
      )
  },
{
  path:
    'warehouses',

  canActivate: [
    permissionGuard
  ],

  data: {
    permission:
      'warehouses.view'
  },

  loadChildren: () =>
    import(
      './warehouses/warehouses.routes'
    )
      .then(
        module =>
          module.warehousesRoutes
      )
},
{
  path:
    'stock-transactions',

  canActivate: [
    permissionGuard
  ],

  data: {
    permission:
      'stock-transactions.view'
  },

  loadChildren: () =>
    import(
      './stock-transactions/stock-transactions.routes'
    )
      .then(
        module =>
          module.stockTransactionsRoutes
      )
},
{
  path:
    'suppliers',

  canActivate: [
    permissionGuard
  ],

  data: {
    permission:
      'suppliers.view'
  },

  loadChildren: () =>
    import(
      './suppliers/suppliers.routes'
    )
      .then(
        module =>
          module.suppliersRoutes
      )
},
{
  path:
    'purchase-requests',

  canActivate: [
    permissionGuard
  ],

  data: {
    permission:
      'purchase-requests.view'
  },

  loadChildren: () =>
    import(
      './purchase-requests/purchase-requests.routes'
    )
      .then(
        module =>
          module.purchaseRequestsRoutes
      )
},
{
  path:
    'purchase-orders',

  canActivate: [
    permissionGuard
  ],

  data: {
    permission:
      'purchase-orders.view'
  },

  loadChildren: () =>
    import(
      './purchase-orders/purchase-orders.routes'
    )
      .then(
        module =>
          module.purchaseOrdersRoutes
      )
},
{
  path:
    'goods-receipts',

  canActivate: [
    permissionGuard
  ],

  data: {
    permission:
      'goods-receipts.view'
  },

  loadChildren: () =>
    import(
      './goods-receipts/goods-receipts.routes'
    )
      .then(
        module =>
          module.goodsReceiptsRoutes
      )
},


  // =========================================================
  // OTHER INVENTORY RESOURCES
  // =========================================================

  ...[
    'warehouses',
    'stock-transactions',
    'suppliers',
    'purchase-requests',
    'purchase-orders',
    'goods-receipts'
  ].map(
    path => ({
      path,

      loadComponent: () =>
        import(
          '../../shared/resource/resource-page.component'
        ).then(
          module =>
            module.ResourcePageComponent
        ),

      canActivate: [
        permissionGuard
      ],

      data: {
        resource: path,
        permission: `${path}.view`
      }
    })
  )
];
