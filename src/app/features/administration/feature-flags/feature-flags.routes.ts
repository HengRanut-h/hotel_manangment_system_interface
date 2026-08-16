import {
  Routes
} from '@angular/router';

export const featureFlagsRoutes:
  Routes =
[
  {
    path:
      '',

    loadComponent: () =>
      import(
        './pages/feature-flags-list/feature-flags-list.page'
      )
        .then(
          module =>
            module.FeatureFlagsListPage
        )
  },

  {
    path:
      'create',

    loadComponent: () =>
      import(
        './pages/feature-flags-create/feature-flags-create.page'
      )
        .then(
          module =>
            module.FeatureFlagsCreatePage
        )
  },

  {
    path:
      'analytics',

    loadComponent: () =>
      import(
        './pages/feature-flags-analytics/feature-flags-analytics.page'
      )
        .then(
          module =>
            module.FeatureFlagsAnalyticsPage
        )
  },

  {
    path:
      ':id/edit',

    loadComponent: () =>
      import(
        './pages/feature-flags-edit/feature-flags-edit.page'
      )
        .then(
          module =>
            module.FeatureFlagsEditPage
        )
  },

  {
    path:
      ':id',

    loadComponent: () =>
      import(
        './pages/feature-flags-detail/feature-flags-detail.page'
      )
        .then(
          module =>
            module.FeatureFlagsDetailPage
        )
  }
];
