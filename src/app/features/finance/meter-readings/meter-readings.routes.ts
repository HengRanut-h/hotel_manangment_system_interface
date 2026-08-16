import {
  Routes
} from '@angular/router';

export const meterReadingsRoutes:
  Routes =
[
  {
    path:
      '',

    loadComponent: () =>
      import(
        './pages/meter-readings-home/meter-readings-home.page'
      )
        .then(
          module =>
            module.MeterReadingsHomePage
        )
  },

  {
    path:
      'create',

    loadComponent: () =>
      import(
        './pages/meter-readings-create/meter-readings-create.page'
      )
        .then(
          module =>
            module.MeterReadingsCreatePage
        )
  }
];
