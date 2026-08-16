import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  finalize
} from 'rxjs';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  LucideArrowLeft,
  LucidePlay
} from '@lucide/angular';

import {
  ReportDefinition,
  RunReportRequest
} from '../../models/report.model';

import {
  ReportsApiService
} from '../../data-access/reports-api.service';

import {
  ReportRunFormComponent
} from '../../components/report-run-form/report-run-form.component';

@Component({
  selector:
    'app-reports-run-page',

  standalone:
    true,

  imports: [
    RouterLink,
    ReportRunFormComponent,
    LucideArrowLeft,
    LucidePlay
  ],

  templateUrl:
    './reports-run.page.html',

  styleUrl:
    './reports-run.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ReportsRunPage {

  private readonly api =
    inject(ReportsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly report =
    signal<ReportDefinition | null>(
      null
    );

  readonly loading =
    signal(false);

  readonly submitting =
    signal(false);

  readonly error =
    signal(false);

  readonly id =
    this.route.snapshot.paramMap.get(
      'id'
    );

  constructor() {

    if (
      this.id
    ) {
      this.load();
    } else {
      this.error.set(
        true
      );
    }
  }

  load(): void {

    if (
      !this.id
    ) {
      return;
    }

    this.loading.set(
      true
    );

    this.api
      .getDefinitionById(
        this.id
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.loading.set(
              false
            )
        )
      )
      .subscribe({
        next:
          report =>
            this.report.set(
              report
            ),

        error:
          error => {

            console.error(
              'Load report run page error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }

  run(
    request:
      RunReportRequest
  ): void {

    this.submitting.set(
      true
    );

    this.error.set(
      false
    );

    this.api
      .run(
        request
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.submitting.set(
              false
            )
        )
      )
      .subscribe({
        next:
          run =>
            this.router.navigate(
              [
                '/app/analytics/reports/history',
                run.id
              ]
            ),

        error:
          error => {

            console.error(
              'Run report error',
              error
            );

            this.error.set(
              true
            );
          }
      });
  }

  cancel(): void {

    this.router.navigate(
      this.id
        ? [
            '/app/analytics/reports',
            this.id
          ]
        : [
            '/app/analytics/reports'
          ]
    );
  }
}
