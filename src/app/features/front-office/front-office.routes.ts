import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../core/guards/permission.guard';


export const frontOfficeRoutes: Routes = [

  // =========================================================
  // AVAILABILITY
  // =========================================================

  {
    path:
      'availability',

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'availability.view'
    },

    loadChildren: () =>
      import(
        './availability/availability.routes'
      )
        .then(
          module =>
            module.availabilityRoutes
        )
  },

  // =========================================================
  // RESERVATIONS
  // =========================================================

  {
    path:
      'reservations',

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'reservations.view'
    },

    loadChildren: () =>
      import(
        './reservations/reservations.routes'
      )
        .then(
          module =>
            module.reservationsRoutes
        )
  },


  // =========================================================
  // CHECK INS
  // =========================================================

  {
    path:
      'check-ins',

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'reservations.check-in'
    },

    loadChildren: () =>
      import(
        './check-ins/check-ins.routes'
      )
        .then(
          module =>
            module.checkInsRoutes
        )
  },


  // =========================================================
  // CHECK OUTS
  // =========================================================

  {
    path:
      'check-outs',

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'reservations.check-out'
    },

    loadChildren: () =>
      import(
        './check-outs/check-outs.routes'
      )
        .then(
          module =>
            module.checkOutsRoutes
        )
  },


  // =========================================================
  // GUESTS
  // =========================================================

  {
    path:
      'guests',

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'guests.view'
    },

    loadChildren: () =>
      import(
        './guests/guests.routes'
      )
        .then(
          module =>
            module.guestsRoutes
        )
  },


  // =========================================================
  // ROOM ASSIGNMENTS
  // =========================================================

  {
    path:
      'room-assignments',

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'room-assignments.view'
    },

    loadChildren: () =>
      import(
        './room-assignments/room-assignments.routes'
      )
        .then(
          module =>
            module.roomAssignmentsRoutes
        )
  },


  // =========================================================
  // ROOM CHANGES
  // =========================================================

  {
    path:
      'room-changes',

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'room-changes.view'
    },

    loadChildren: () =>
      import(
        './room-changes/room-changes.routes'
      )
        .then(
          module =>
            module.roomChangesRoutes
        )
  },


  // =========================================================
  // STAY EXTENSIONS
  // =========================================================

  {
    path:
      'stay-extensions',

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'stay-extensions.view'
    },

    loadChildren: () =>
      import(
        './stay-extensions/stay-extensions.routes'
      )
        .then(
          module =>
            module.stayExtensionsRoutes
        )
  }

];
