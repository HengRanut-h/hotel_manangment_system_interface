import {
  Routes
} from '@angular/router';

export const utilityBillingRoutes:
  Routes =
[
  {
    path:
      '',

    loadComponent: () =>
      import(
        './pages/utility-billing-dashboard/utility-billing-dashboard.page'
      )
        .then(
          module =>
            module.UtilityBillingDashboardPage
        )
  },


  // =======================================================
  // UTILITIES
  // =======================================================

  {
    path:
      'utilities',

    loadComponent: () =>
      import(
        './pages/utilities/utilities.page'
      )
        .then(
          module =>
            module.UtilitiesListPage
        )
  },

  {
    path:
      'utilities/create',

    loadComponent: () =>
      import(
        './pages/utilities/utilities-create.page'
      )
        .then(
          module =>
            module.UtilityCreatePage
        )
  },

  {
    path:
      'utilities/:id/edit',

    loadComponent: () =>
      import(
        './pages/utilities/utilities-edit.page'
      )
        .then(
          module =>
            module.UtilityEditPage
        )
  },

  {
    path:
      'utilities/:id',

    loadComponent: () =>
      import(
        './pages/utilities/utilities-detail.page'
      )
        .then(
          module =>
            module.UtilityDetailPage
        )
  },


  // =======================================================
  // RATES
  // =======================================================

  {
    path:
      'rates',

    loadComponent: () =>
      import(
        './pages/rates/rates.page'
      )
        .then(
          module =>
            module.UtilityRatesListPage
        )
  },

  {
    path:
      'rates/create',

    loadComponent: () =>
      import(
        './pages/rates/rates-create.page'
      )
        .then(
          module =>
            module.UtilityRateCreatePage
        )
  },

  {
    path:
      'rates/:id/edit',

    loadComponent: () =>
      import(
        './pages/rates/rates-edit.page'
      )
        .then(
          module =>
            module.UtilityRateEditPage
        )
  },

  {
    path:
      'rates/:id',

    loadComponent: () =>
      import(
        './pages/rates/rates-detail.page'
      )
        .then(
          module =>
            module.UtilityRateDetailPage
        )
  },


  // =======================================================
  // METERS
  // =======================================================

  {
    path:
      'meters',

    loadComponent: () =>
      import(
        './pages/meters/meters.page'
      )
        .then(
          module =>
            module.UtilityMetersListPage
        )
  },

  {
    path:
      'meters/create',

    loadComponent: () =>
      import(
        './pages/meters/meters-create.page'
      )
        .then(
          module =>
            module.UtilityMeterCreatePage
        )
  },

  {
    path:
      'meters/:id/edit',

    loadComponent: () =>
      import(
        './pages/meters/meters-edit.page'
      )
        .then(
          module =>
            module.UtilityMeterEditPage
        )
  },

  {
    path:
      'meters/:id',

    loadComponent: () =>
      import(
        './pages/meters/meters-detail.page'
      )
        .then(
          module =>
            module.UtilityMeterDetailPage
        )
  },


  // =======================================================
  // READINGS
  // =======================================================

  {
    path:
      'readings',

    loadComponent: () =>
      import(
        './pages/readings/readings.page'
      )
        .then(
          module =>
            module.MeterReadingsListPage
        )
  },

  {
    path:
      'readings/create',

    loadComponent: () =>
      import(
        './pages/readings/readings-create.page'
      )
        .then(
          module =>
            module.MeterReadingCreatePage
        )
  },

  {
    path:
      'readings/:id/edit',

    loadComponent: () =>
      import(
        './pages/readings/readings-edit.page'
      )
        .then(
          module =>
            module.MeterReadingEditPage
        )
  },

  {
    path:
      'readings/:id',

    loadComponent: () =>
      import(
        './pages/readings/readings-detail.page'
      )
        .then(
          module =>
            module.MeterReadingDetailPage
        )
  },


  // =======================================================
  // ANALYTICS
  // =======================================================

  {
    path:
      'analytics',

    loadComponent: () =>
      import(
        './pages/utility-billing-analytics/utility-billing-analytics.page'
      )
        .then(
          module =>
            module.UtilityBillingAnalyticsPage
        )
  }
];
