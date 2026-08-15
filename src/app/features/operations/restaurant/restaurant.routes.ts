import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../../core/guards/permission.guard';

export const restaurantRoutes:
  Routes = [

    {
      path: '',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'restaurant.view'
      },

      loadComponent: () =>
        import(
          './pages/restaurant-pos/restaurant-pos.page'
        )
          .then(
            module =>
              module.RestaurantPosPage
          )
    },

    {
      path:
        'menu',

      canActivate: [
        permissionGuard
      ],

      data: {
        permission:
          'restaurant.view'
      },

      loadComponent: () =>
        import(
          './pages/restaurant-menu/restaurant-menu.page'
        )
          .then(
            module =>
              module.RestaurantMenuPage
          )
    }
  ];
