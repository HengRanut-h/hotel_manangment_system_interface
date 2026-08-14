import {
  Routes
} from '@angular/router';

export const propertyRoutes:
  Routes = [
    {
      path: '',
      loadComponent: () =>
        import(
          './pages/property-home/property-home.page'
        ).then(
          module =>
            module.PropertyHomePage
        )
    },

    {
      path: 'hotels',
      loadChildren: () =>
        import(
          './hotels/hotels.routes'
        ).then(
          module =>
            module.hotelRoutes
        )
    },

    {
      path: 'branches',
      loadChildren: () =>
        import(
          './branches/branches.routes'
        ).then(
          module =>
            module.BranchesRoutes
        )
    },

    {
      path: 'buildings',
      loadChildren: () =>
        import(
          './buildings/buildings.routes'
        ).then(
          module =>
            module.BuildingsRoutes
        )
    },

    {
      path: 'floors',
      loadChildren: () =>
        import(
          './floors/floors.routes'
        ).then(
          module =>
            module.FloorsRoutes
        )
    },

    {
      path: 'room-types',
      loadChildren: () =>
        import(
          './room-types/room-types.routes'
        ).then(
          module =>
            module.RoomTypesRoutes
        )
    },

    {
      path: 'rooms',
      loadChildren: () =>
        import(
          './rooms/rooms.routes'
        ).then(
          module =>
            module.RoomsRoutes
        )
    },

    {
      path: 'amenities',
      loadChildren: () =>
        import(
          './amenities/amenities.routes'
        ).then(
          module =>
            module.AmenitiesRoutes
        )
    },

    {
      path: 'rates',
      loadChildren: () =>
        import(
          './rates/rates.routes'
        ).then(
          module =>
            module.RatesRoutes
        )
    }
  ];
