import {
  Routes
} from '@angular/router';

export const hotelRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './pages/hotel-list/hotel-list.page'
      ).then(
        module =>
          module.HotelListPage
      )
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        './pages/hotel-create/hotel-create.page'
      ).then(
        module =>
          module.HotelCreatePage
      )
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import(
        './pages/hotel-edit/hotel-edit.page'
      ).then(
        module =>
          module.HotelEditPage
      )
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './pages/hotel-detail/hotel-detail.page'
      ).then(
        module =>
          module.HotelDetailPage
      )
  }
];
