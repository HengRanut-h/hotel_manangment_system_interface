import {
  Route,
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../core/guards/permission.guard';


// =========================================================
// DATA EXPLORER ROUTE HELPER
// =========================================================

const explorer = (
  path: string,
  title: string,
  endpoint: string,
  permission: string,
  columns: unknown[]
): Route => ({
  path,

  loadComponent: () =>
    import(
      '../../shared/pages/data-explorer/data-explorer.page'
    )
      .then(
        module =>
          module.DataExplorerPage
      ),

  canActivate: [
    permissionGuard
  ],

  data: {
    title,
    endpoint,
    permission,
    columns
  }
});


// =========================================================
// GENERIC OPERATIONS ROUTES
//
// These features are still using ResourcePageComponent.
// Remove them from this array one-by-one when each feature
// gets its own dedicated routes/pages.
// =========================================================

const genericOperationsRoutes:
  Route[] = [

    'guest-requests',
    'complaints',
    'lost-and-found',
    'laundry',
    'transportation',
    'security-incidents'

  ]
    .map(
      (path): Route => ({

        path,

        loadComponent: () =>
          import(
            '../../shared/resource/resource-page.component'
          )
            .then(
              module =>
                module.ResourcePageComponent
            ),

        canActivate: [
          permissionGuard
        ],

        data: {
          resource:
            path,

          permission:
            `${path}.view`
        }
      })
    );


// =========================================================
// OPERATIONS ROUTES
// =========================================================

export const operationsRoutes:
  Routes = [

    // =====================================================
    // DEFAULT
    // =====================================================

    {
      path: '',

      pathMatch:
        'full',

      redirectTo:
        'housekeeping'
    },


    // =====================================================
    // HOUSEKEEPING
    //
    // /app/operations/housekeeping
    // =====================================================

    {
      path:
        'housekeeping',

      loadChildren: () =>
        import(
          './housekeeping/housekeeping.routes'
        )
          .then(
            module =>
              module.housekeepingRoutes
          )
    },


    // =====================================================
    // ROOM INSPECTIONS
    //
    // /app/operations/room-inspections
    // =====================================================

    {
      path:
        'room-inspections',

      loadChildren: () =>
        import(
          './room-inspections/room-inspections.routes'
        )
          .then(
            module =>
              module.roomInspectionsRoutes
          )
    },


    // =====================================================
    // MAINTENANCE
    //
    // /app/operations/maintenance
    // =====================================================

    {
      path:
        'maintenance',

      loadChildren: () =>
        import(
          './maintenance/maintenance.routes'
        )
          .then(
            module =>
              module.maintenanceRoutes
          )
    },


    // =====================================================
    // GUEST SERVICES
    //
    // Dedicated feature.
    //
    // IMPORTANT:
    // Do NOT put "services" back into
    // genericOperationsRoutes.
    //
    // URL:
    // /app/operations/services
    //
    // Folder:
    // operations/guest-services
    // =====================================================

    {
      path:
        'services',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'services.view'
      },

      loadChildren: () =>
        import(
          './guest-services/guest-services.routes'
        )
          .then(
            module =>
              module.guestServicesRoutes
          )
    },
    {
  path:
    'guest-requests',

  canActivate: [
    permissionGuard
  ],

  data: {
    permission:
      'guest-requests.view'
  },

  loadChildren: () =>
    import(
      './guest-requests/guest-requests.routes'
    )
      .then(
        module =>
          module.guestRequestsRoutes
      )
},
{
  path:
    'complaints',

  canActivate: [
    permissionGuard
  ],

  data: {
    permission:
      'complaints.view'
  },

  loadChildren: () =>
    import(
      './complaints/complaints.routes'
    )
      .then(
        module =>
          module.complaintsRoutes
      )
},
{
  path:
    'lost-and-found',

  canActivate: [
    permissionGuard
  ],

  data: {
    permission:
      'lost-and-found.view'
  },

  loadChildren: () =>
    import(
      './lost-and-found/lost-and-found.routes'
    )
      .then(
        module =>
          module.lostAndFoundRoutes
      )
},
{
  path:
    'laundry',

  canActivate: [
    permissionGuard
  ],

  data: {
    permission:
      'laundry.view'
  },

  loadChildren: () =>
    import(
      './laundry/laundry.routes'
    )
      .then(
        module =>
          module.laundryRoutes
      )
},


    // =====================================================
    // GENERIC OPERATIONS
    //
    // Temporary until each feature gets a dedicated module.
    //
    // guest-requests
    // complaints
    // lost-and-found
    // laundry
    // transportation
    // security-incidents
    // =====================================================

    ...genericOperationsRoutes,


    // =====================================================
    // RESTAURANT / POS
    //
    // /app/operations/restaurant
    // =====================================================

    explorer(
      'restaurant',

      'Restaurant / POS',

      'restaurant/menu',

      'restaurant.view',

      [
        {
          key:
            'name',

          label:
            'Menu Item'
        },

        {
          key:
            'price',

          label:
            'Price',

          type:
            'money'
        },

        {
          key:
            'isAvailable',

          label:
            'Available'
        },

        {
          key:
            'categoryId',

          label:
            'Category'
        }
      ]
    ),


    // =====================================================
    // FALLBACK
    // =====================================================

    {
      path:
        '**',

      redirectTo:
        'housekeeping'
    }
  ];
