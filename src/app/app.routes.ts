import {
  Routes
} from '@angular/router';

import {
  authGuard
} from './core/guards/auth.guard';

import {
  guestGuard
} from './core/guards/guest.guard';

import {
  staffGuard
} from './core/guards/staff.guard';

import {
  guestPortalGuard
} from './core/guards/guest-portal.guard';

import {
  permissionGuard
} from './core/guards/permission.guard';

export const routes:
  Routes =
[
  // =========================================================
  // AUTHENTICATION
  // =========================================================

  {
    path:
      'auth',

    canActivate:
    [
      guestGuard
    ],

    loadComponent:
      () =>
        import(
          './layouts/auth-layout/auth-layout.component'
        )
          .then(
            module =>
              module.AuthLayoutComponent
          ),

    children:
    [
      // =====================================================
      // LOGIN
      // =====================================================

      {
        path:
          'login',

        loadComponent:
          () =>
            import(
              './features/authentication/pages/login/login.page'
            )
              .then(
                module =>
                  module.LoginPage
              )
      },

      // =====================================================
      // REGISTER
      // =====================================================

      {
        path:
          'register',

        loadComponent:
          () =>
            import(
              './features/authentication/pages/register/register.page'
            )
              .then(
                module =>
                  module.RegisterPage
              )
      },

      {
        path:
          '',

        pathMatch:
          'full',

        redirectTo:
          'login'
      }
    ]
  },

  // =========================================================
  // STAFF APPLICATION
  // =========================================================

  {
    path:
      'app',

    canActivate:
    [
      authGuard,
      staffGuard
    ],

    loadComponent:
      () =>
        import(
          './layouts/app-layout/app-layout.component'
        )
          .then(
            module =>
              module.AppLayoutComponent
          ),

    children:
    [
      {
        path:
          'dashboard',

        loadComponent:
          () =>
            import(
              './features/dashboard/pages/dashboard/dashboard.page'
            )
              .then(
                module =>
                  module.DashboardPage
              ),

        canActivate:
        [
          permissionGuard
        ],

        data:
        {
          permission:
            'dashboard.view'
        }
      },

      {
        path:
          'front-office',

        loadChildren:
          () =>
            import(
              './features/front-office/front-office.routes'
            )
              .then(
                module =>
                  module.frontOfficeRoutes
              )
      },

      {
        path:
          'property',

        loadChildren:
          () =>
            import(
              './features/property/property.routes'
            )
              .then(
                module =>
                  module.propertyRoutes
              )
      },

      {
        path:
          'finance',

        loadChildren:
          () =>
            import(
              './features/finance/finance.routes'
            )
              .then(
                module =>
                  module.financeRoutes
              )
      },

      {
        path:
          'operations',

        loadChildren:
          () =>
            import(
              './features/operations/operations.routes'
            )
              .then(
                module =>
                  module.operationsRoutes
              )
      },

      {
        path:
          'inventory',

        loadChildren:
          () =>
            import(
              './features/inventory/inventory.routes'
            )
              .then(
                module =>
                  module.inventoryRoutes
              )
      },

      {
        path:
          'hr',

        loadChildren:
          () =>
            import(
              './features/hr/hr.routes'
            )
              .then(
                module =>
                  module.hrRoutes
              )
      },

      {
        path:
          'admin',

        loadChildren:
          () =>
            import(
              './features/administration/administration.routes'
            )
              .then(
                module =>
                  module.administrationRoutes
              )
      },

      {
        path:
          'profile',

        loadComponent:
          () =>
            import(
              './features/profile/pages/profile/profile.page'
            )
              .then(
                module =>
                  module.ProfilePage
              )
      },

      {
        path:
          'forbidden',

        loadComponent:
          () =>
            import(
              './shared/pages/forbidden/forbidden.page'
            )
              .then(
                module =>
                  module.ForbiddenPage
              )
      },

      {
        path:
          '',

        pathMatch:
          'full',

        redirectTo:
          'dashboard'
      }
    ]
  },

  // =========================================================
  // GUEST PORTAL
  // =========================================================

  {
    path:
      'guest',

    canActivate:
    [
      authGuard,
      guestPortalGuard
    ],

    loadComponent:
      () =>
        import(
          './layouts/guest-layout/guest-layout.component'
        )
          .then(
            module =>
              module.GuestLayoutComponent
          ),

    loadChildren:
      () =>
        import(
          './features/guest/guest.routes'
        )
          .then(
            module =>
              module.guestRoutes
          )
  },

  // =========================================================
  // ROOT
  // =========================================================

  {
    path:
      '',

    pathMatch:
      'full',

    redirectTo:
      'app/dashboard'
  },

  // =========================================================
  // NOT FOUND
  // =========================================================

  {
    path:
      '**',

    loadComponent:
      () =>
        import(
          './shared/pages/not-found/not-found.page'
        )
          .then(
            module =>
              module.NotFoundPage
          )
  }
];
