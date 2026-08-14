import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../core/guards/permission.guard';

export const propertyRoutes: Routes = [

  // =========================================================
  // HOTELS
  // Full custom feature
  // =========================================================

  {
    path: 'hotels',

    loadChildren: () =>
      import(
        './hotels/hotels.routes'
      ).then(
        m => m.hotelRoutes
      )
  },

  // =========================================================
  // BRANCHES
  // Full custom feature
  // =========================================================

  {
    path: 'branches',

    loadChildren: () =>
      import(
        './branches/branches.routes'
      ).then(
        m => m.branchRoutes
      )
  },

  // =========================================================
  // BUILDINGS
  // Full custom feature
  // =========================================================

  {
    path: 'buildings',

    loadChildren: () =>
      import(
        './buildings/buildings.routes'
      ).then(
        m => m.buildingRoutes
      )
  },

  // =========================================================
  // FLOORS
  // Full custom feature
  // =========================================================

  {
    path: 'floors',

    loadChildren: () =>
      import(
        './floors/floors.routes'
      ).then(
        m => m.floorRoutes
      )
  },

  // =========================================================
  // ROOMS
  // =========================================================

  {
    path: 'rooms',

    loadComponent: () =>
      import(
        './pages/rooms/rooms.page'
      ).then(
        m => m.RoomsPage
      ),

    canActivate: [
      permissionGuard
    ],

    data: {
      permission: 'rooms.view'
    }
  },

  // =========================================================
  // ROOM TYPES
  // =========================================================

  {
    path: 'room-types',

    loadComponent: () =>
      import(
        './pages/room-types/room-types.page'
      ).then(
        m => m.RoomTypesPage
      ),

    canActivate: [
      permissionGuard
    ],

    data: {
      permission: 'room-types.view'
    }
  },

  // =========================================================
  // GENERIC PROPERTY RESOURCES
  // =========================================================

  ...[
    'amenities',
    'rates'
  ].map(
    path => ({
      path,

      loadComponent: () =>
        import(
          '../../shared/resource/resource-page.component'
        ).then(
          m =>
            m.ResourcePageComponent
        ),

      canActivate: [
        permissionGuard
      ],

      data: {
        resource: path,
        permission:
          `${path}.view`
      }
    })
  )
];
