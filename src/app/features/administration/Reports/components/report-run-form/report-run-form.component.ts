import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  input,
  output,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  LucidePlay,
  LucideX,
  LucideCalendarDays,
  LucideFileDown
} from '@lucide/angular';

import {
  ReportDefinition,
  RunReportRequest
} from '../../models/report.model';

@Component({
  selector:
    'app-report-run-form',

  standalone:
    true,

  imports: [
    FormsModule,
    LucidePlay,
    LucideX,
    LucideCalendarDays,
    LucideFileDown
  ],

  templateUrl:
    './report-run-form.component.html',

  styleUrl:
    './report-run-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ReportRunFormComponent
  implements OnChanges {

  readonly report =
    input.required<ReportDefinition>();

  readonly submitting =
    input(false);

  readonly submitted =
    output<RunReportRequest>();

  readonly cancelled =
    output<void>();

  readonly fromDate =
    signal('');

  readonly toDate =
    signal('');

  readonly hotelId =
    signal('');

  readonly branchId =
    signal('');

  readonly format =
    signal('Pdf');

  readonly touched =
    signal(false);

  ngOnChanges(
    changes:
      SimpleChanges
  ): void {

    if (
      changes['report']
    ) {
      this.format.set(
        this.report()
          .defaultFormat ??
        'Pdf'
      );
    }
  }

  dateRangeInvalid(): boolean {

    if (
      !this.fromDate() ||
      !this.toDate()
    ) {
      return false;
    }

    return (
      new Date(
        `${this.toDate()}T23:59:59`
      ) <
      new Date(
        `${this.fromDate()}T00:00:00`
      )
    );
  }

  submit(): void {

    this.touched.set(
      true
    );

    if (
      this.dateRangeInvalid() ||
      this.submitting()
    ) {
      return;
    }

    this.submitted.emit({
      reportId:
        this.report().id,

      fromUtc:
        this.fromDate()
          ? new Date(
              `${this.fromDate()}T00:00:00`
            ).toISOString()
          : null,

      toUtc:
        this.toDate()
          ? new Date(
              `${this.toDate()}T23:59:59`
            ).toISOString()
          : null,

      hotelId:
        this.hotelId()
          .trim() ||
        null,

      branchId:
        this.branchId()
          .trim() ||
        null,

      format:
        this.format()
    });
  }

  cancel(): void {

    if (
      !this.submitting()
    ) {
      this.cancelled.emit();
    }
  }
}
