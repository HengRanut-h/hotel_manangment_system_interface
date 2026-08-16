// src/app/features/finance/finance.routes.ts

import {
  Routes
} from '@angular/router';

import {
  permissionGuard
} from '../../core/guards/permission.guard';


// =========================================================
// DATA EXPLORER
// =========================================================

const explorer = (
  path: string,
  title: string,
  endpoint: string,
  permission: string,
  columns: unknown[]
) => ({
  path,

  loadComponent: () =>
    import(
      '../../shared/pages/data-explorer/data-explorer.page'
    )
      .then(
        module =>
          module.DataExplorerPage
      ),

  canActivate: [
    permissionGuard
  ],

  data: {
    title,
    endpoint,
    permission,
    columns
  }
});


// =========================================================
// FINANCE ROUTES
// =========================================================

export const financeRoutes:
  Routes =
[

  // =======================================================
  // FOLIOS
  // =======================================================

  {
    path:
      'folios',

    loadChildren: () =>
      import(
        './folios/folios.routes'
      )
        .then(
          module =>
            module.foliosRoutes
        ),

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'folios.view'
    }
  },


  // =======================================================
  // INVOICES
  // =======================================================

  {
    path:
      'invoices',

    loadChildren: () =>
      import(
        './invoices/invoices.routes'
      )
        .then(
          module =>
            module.invoicesRoutes
        ),

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'invoices.view'
    }
  },


  // =======================================================
  // PAYMENTS
  // =======================================================

  {
    path:
      'payments',

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'payments.view'
    },

    loadChildren: () =>
      import(
        './payments/payments.routes'
      )
        .then(
          module =>
            module.paymentRoutes
        )
  },


  // =======================================================
  // DEPOSITS
  // =======================================================

  {
    path:
      'deposits',

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'deposits.view'
    },

    loadChildren: () =>
      import(
        './deposits/deposits.routes'
      )
        .then(
          module =>
            module.depositRoutes
        )
  },


  // =======================================================
  // REFUNDS
  //
  {
    path:
      'refunds',

    loadChildren: () =>
      import(
        './refunds/refunds.routes'
      )
        .then(
          module =>
            module.refundRoutes
        ),

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'refunds.view'
    }
  },


  // =======================================================
  // TAXES
  // =======================================================

  {
    path:
      'taxes',

    loadChildren: () =>
      import(
        './taxes/taxes.routes'
      )
        .then(
          module =>
            module.taxRoutes
        ),

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'taxes.view'
    }
  },


  // =======================================================
  // DISCOUNTS
  // =======================================================

  {
    path:
      'discounts',

    loadChildren: () =>
      import(
        './discounts/discounts.routes'
      )
        .then(
          module =>
            module.discountsRoutes
        ),

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'discounts.view'
    }
  },


  // =======================================================
  // UTILITIES
  // =======================================================

  {
    path:
      'utilities',

    loadChildren: () =>
      import(
        './utility-billing/utility-billing.routes'
      )
        .then(
          module =>
            module.utilityBillingRoutes
        ),

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'utilities.view'
    }
  },


  // =======================================================
  // UTILITY RATES
  // =======================================================

  {
    path:
      'utility-rates',

    loadChildren: () =>
      import(
        './utility-rates/utility-rates.routes'
      )
        .then(
          module =>
            module.utilityRatesRoutes
        ),

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'utility-rates.view'
    }
  },


  // =======================================================
  // UTILITY METERS
  // =======================================================

  {
    path:
      'utility-meters',

    loadChildren: () =>
      import(
        './utility-meters/utility-meters.routes'
      )
        .then(
          module =>
            module.utilityMetersRoutes
        ),

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'utilities.view'
    }
  },


  // =======================================================
  // METER READINGS
  // =======================================================

  {
    path:
      'meter-readings',

    loadChildren: () =>
      import(
        './meter-readings/meter-readings.routes'
      )
        .then(
          module =>
            module.meterReadingsRoutes
        ),

    canActivate: [
      permissionGuard
    ],

    data: {
      permission:
        'utilities.view'
    }
  }

];
