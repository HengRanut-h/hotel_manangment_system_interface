import {
  Routes
} from '@angular/router';

export const reportsRoutes:
  Routes =
[
  {
    path:
      '',

    loadComponent: () =>
      import(
        './pages/reports-home/reports-home.page'
      )
        .then(
          module =>
            module.ReportsHomePage
        )
  },

  {
    path:
      'revenue',

    loadComponent: () =>
      import(
        './pages/revenue-report/revenue-report.page'
      )
        .then(
          module =>
            module.RevenueReportPage
        )
  },

  {
    path:
      'occupancy',

    loadComponent: () =>
      import(
        './pages/occupancy-report/occupancy-report.page'
      )
        .then(
          module =>
            module.OccupancyReportPage
        )
  }
];
