import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';


export const guestServicesRoutes:
  Routes = [

    // =====================================================
    // LIST
    //
    // /app/operations/services
    // =====================================================

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'services.view'
      },

      loadComponent: () =>
        import(
          './pages/guest-services-list/guest-services-list.page'
        )
          .then(
            module =>
              module.GuestServicesListPage
          )
    },


    // =====================================================
    // CREATE
    //
    // /app/operations/services/create
    // =====================================================

    {
      path:
        'create',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'services.create'
      },

      loadComponent: () =>
        import(
          './pages/guest-services-create/guest-services-create.page'
        )
          .then(
            module =>
              module.GuestServicesCreatePage
          )
    },


    // =====================================================
    // EDIT
    //
    // IMPORTANT:
    // Keep :id/edit BEFORE :id
    //
    // /app/operations/services/:id/edit
    // =====================================================

    {
      path:
        ':id/edit',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'services.update'
      },

      loadComponent: () =>
        import(
          './pages/guest-services-edit/guest-services-edit.page'
        )
          .then(
            module =>
              module.GuestServicesEditPage
          )
    },


    // =====================================================
    // DETAIL
    //
    // /app/operations/services/:id
    // =====================================================

    {
      path:
        ':id',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'services.view'
      },

      loadComponent: () =>
        import(
          './pages/guest-services-detail/guest-services-detail.page'
        )
          .then(
            module =>
              module.GuestServicesDetailPage
          )
    }
  ];
