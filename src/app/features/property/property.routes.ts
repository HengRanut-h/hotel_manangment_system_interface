import {
  Routes
} from '@angular/router';

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

    loadChildren: () =>
      import(
        './rooms/rooms.routes'
      ).then(
        m => m.roomRoutes
      )
  },

  // =========================================================
  // ROOM TYPES
  // =========================================================

  {
    path: 'room-types',

    loadChildren: () =>
      import(
        './room-types/room-types.routes'
      ).then(
        m => m.roomTypeRoutes
      )
  },

  // =========================================================
  // AMENITIES
  // =========================================================

  {
    path: 'amenities',

    loadChildren: () =>
      import(
        './amenities/amenities.routes'
      ).then(
        m => m.amenityRoutes
      )
  },

  // =========================================================
  // RATES
  // =========================================================

  {
    path: 'rates',

    loadChildren: () =>
      import(
        './rates/rates.routes'
      ).then(
        m => m.rateRoutes
      )
  }
];
