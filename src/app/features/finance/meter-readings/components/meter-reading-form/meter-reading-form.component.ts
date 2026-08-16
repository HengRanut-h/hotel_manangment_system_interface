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
  LucideActivity,
  LucideSave,
  LucideX
} from '@lucide/angular';

import {
  MeterReading,
  MeterReadingUpsertRequest
} from '../../models/meter-reading.model';

@Component({
  selector:
    'app-meter-reading-form',

  standalone:
    true,

  imports: [
    FormsModule,
    LucideActivity,
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
export class MeterReadingFormComponent
  implements OnChanges {

  readonly initialValue =
    input<MeterReading | null>(
      null
    );

  readonly submitting =
    input(false);

  readonly submitLabel =
    input('Save Reading');

  readonly submitted =
    output<MeterReadingUpsertRequest>();

  readonly cancelled =
    output<void>();

  readonly touched =
    signal(false);

  readonly meterId =
    signal('');

  readonly currentReading =
    signal<number | null>(
      null
    );

  readonly readingDate =
    signal('');

  readonly notes =
    signal('');

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      changes['initialValue']
    ) {
      this.loadInitialValue();
    }
  }

  isInvalid(): boolean {

    const reading =
      this.currentReading();

    return (
      !this.meterId().trim() ||
      reading === null ||
      !Number.isFinite(
        Number(
          reading
        )
      ) ||
      Number(
        reading
      ) < 0 ||
      !this.readingDate()
    );
  }

  submit(): void {

    this.touched.set(
      true
    );

    if (
      this.isInvalid() ||
      this.submitting()
    ) {
      return;
    }

    this.submitted.emit({
      meterId:
        this.meterId()
          .trim(),

      currentReading:
        Number(
          this.currentReading()
        ),

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

  cancel(): void {

    if (
      !this.submitting()
    ) {
      this.cancelled.emit();
    }
  }

  private loadInitialValue(): void {

    const item =
      this.initialValue();

    if (
      !item
    ) {
      return;
    }

    this.meterId.set(
      item.meterId ??
      ''
    );

    this.currentReading.set(
      item.currentReading ??
      null
    );

    this.readingDate.set(
      this.toLocalInput(
        item.readingDateUtc
      )
    );

    this.notes.set(
      item.notes ??
      ''
    );
  }

  private toLocalInput(
    value?: string | null
  ): string {

    if (
      !value
    ) {
      return '';
    }

    const date =
      new Date(
        value
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '';
    }

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
