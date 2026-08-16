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
  LucideGauge,
  LucideSave,
  LucideX
} from '@lucide/angular';

import {
  UtilityMeter,
  UtilityMeterUpsertRequest
} from '../../models/utility-meter.model';

@Component({
  selector:
    'app-utility-meter-form',

  standalone:
    true,

  imports: [
    FormsModule,
    LucideGauge,
    LucideSave,
    LucideX
  ],

  templateUrl:
    './utility-meter-form.component.html',

  styleUrl:
    './utility-meter-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityMeterFormComponent
  implements OnChanges {

  readonly initialValue =
    input<UtilityMeter | null>(
      null
    );

  readonly submitting =
    input(false);

  readonly submitLabel =
    input('Save Meter');

  readonly submitted =
    output<UtilityMeterUpsertRequest>();

  readonly cancelled =
    output<void>();

  readonly touched =
    signal(false);

  readonly meterNumber =
    signal('');

  readonly utilityId =
    signal('');

  readonly roomId =
    signal('');

  readonly buildingId =
    signal('');

  readonly floorId =
    signal('');

  readonly location =
    signal('');

  readonly initialReading =
    signal<number | null>(
      0
    );

  readonly installedAt =
    signal('');

  readonly isActive =
    signal(true);

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
      this.initialReading();

    return (
      !this.meterNumber().trim() ||
      !this.utilityId().trim() ||
      (
        reading !== null &&
        Number(
          reading
        ) < 0
      )
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
      meterNumber:
        this.meterNumber()
          .trim(),

      utilityId:
        this.utilityId()
          .trim(),

      roomId:
        this.optionalText(
          this.roomId()
        ),

      buildingId:
        this.optionalText(
          this.buildingId()
        ),

      floorId:
        this.optionalText(
          this.floorId()
        ),

      location:
        this.optionalText(
          this.location()
        ),

      initialReading:
        this.initialReading() === null
          ? null
          : Number(
              this.initialReading()
            ),

      installedAtUtc:
        this.toUtc(
          this.installedAt()
        ),

      isActive:
        this.isActive(),

      notes:
        this.optionalText(
          this.notes()
        )
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

    this.meterNumber.set(
      item.meterNumber ??
      ''
    );

    this.utilityId.set(
      item.utilityId ??
      ''
    );

    this.roomId.set(
      item.roomId ??
      ''
    );

    this.buildingId.set(
      item.buildingId ??
      ''
    );

    this.floorId.set(
      item.floorId ??
      ''
    );

    this.location.set(
      item.location ??
      ''
    );

    this.initialReading.set(
      item.initialReading ??
      0
    );

    this.installedAt.set(
      this.toLocalInput(
        item.installedAtUtc
      )
    );

    this.isActive.set(
      item.isActive ??
      true
    );

    this.notes.set(
      item.notes ??
      ''
    );
  }

  private optionalText(
    value: string
  ): string | null {

    const normalized =
      value.trim();

    return normalized ||
      null;
  }

  private toUtc(
    value: string
  ): string | null {

    if (
      !value
    ) {
      return null;
    }

    const date =
      new Date(
        value
      );

    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date.toISOString();
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
