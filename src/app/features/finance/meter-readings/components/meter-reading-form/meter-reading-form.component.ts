import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  LucideGauge,
  LucideSave,
  LucideX
} from '@lucide/angular';

import {
  CreateMeterReadingRequest
} from '../../models/meter-reading.model';

@Component({
  selector:
    'app-meter-reading-form',

  standalone:
    true,

  imports: [
    FormsModule,
    LucideGauge,
    LucideSave,
    LucideX
  ],

  templateUrl:
    './meter-reading-form.component.html',

  styleUrl:
    './meter-reading-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class MeterReadingFormComponent {

  readonly initialMeterId =
    input('');

  readonly submitting =
    input(false);

  readonly submitted =
    output<CreateMeterReadingRequest>();

  readonly cancelled =
    output<void>();

  readonly meterId =
    signal('');

  readonly currentReading =
    signal<number | null>(
      null
    );

  readonly readingDate =
    signal(
      this.toLocalDateTime(
        new Date()
      )
    );

  readonly notes =
    signal('');

  readonly touched =
    signal(false);

  ngOnInit(): void {

    this.meterId.set(
      this.initialMeterId()
    );
  }

  submit(): void {

    this.touched.set(
      true
    );

    const meterId =
      this.meterId()
        .trim();

    const reading =
      Number(
        this.currentReading()
      );

    if (
      !meterId ||
      this.currentReading() === null ||
      !Number.isFinite(
        reading
      ) ||
      reading < 0 ||
      !this.readingDate() ||
      this.submitting()
    ) {
      return;
    }

    this.submitted.emit({
      meterId,

      currentReading:
        reading,

      readingDateUtc:
        new Date(
          this.readingDate()
        ).toISOString(),

      notes:
        this.notes()
          .trim() ||
        null
    });
  }

  private toLocalDateTime(
    date: Date
  ): string {

    const local =
      new Date(
        date.getTime() -
        date.getTimezoneOffset() *
        60000
      );

    return local
      .toISOString()
      .slice(
        0,
        16
      );
  }
}
