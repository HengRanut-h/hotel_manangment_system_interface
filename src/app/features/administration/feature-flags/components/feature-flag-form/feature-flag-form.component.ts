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
  LucideFlag,
  LucideSave,
  LucideX
} from '@lucide/angular';

import {
  FeatureFlag,
  FeatureFlagUpsertRequest
} from '../../models/feature-flag.model';

@Component({
  selector:
    'app-feature-flag-form',

  standalone:
    true,

  imports: [
    FormsModule,
    LucideFlag,
    LucideSave,
    LucideX
  ],

  templateUrl:
    './feature-flag-form.component.html',

  styleUrl:
    './feature-flag-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class FeatureFlagFormComponent
  implements OnChanges {

  readonly initialValue =
    input<FeatureFlag | null>(
      null
    );

  readonly submitting =
    input(false);

  readonly submitLabel =
    input('Save Feature Flag');

  readonly submitted =
    output<FeatureFlagUpsertRequest>();

  readonly cancelled =
    output<void>();

  readonly touched =
    signal(false);

  readonly key =
    signal('');

  readonly name =
    signal('');

  readonly description =
    signal('');

  readonly environment =
    signal('All');

  readonly isEnabled =
    signal(false);

  readonly rolloutPercentage =
    signal(100);

  readonly startsAt =
    signal('');

  readonly endsAt =
    signal('');

  readonly conditionsJson =
    signal('');

  readonly metadataJson =
    signal('');

  ngOnChanges(
    changes:
      SimpleChanges
  ): void {

    if (
      changes['initialValue']
    ) {
      this.loadInitial();
    }
  }

  keyInvalid(): boolean {

    return !/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/i
      .test(
        this.key()
          .trim()
      );
  }

  rolloutInvalid(): boolean {

    const value =
      Number(
        this.rolloutPercentage()
      );

    return (
      !Number.isFinite(
        value
      ) ||
      value < 0 ||
      value > 100
    );
  }

  dateRangeInvalid(): boolean {

    if (
      !this.startsAt() ||
      !this.endsAt()
    ) {
      return false;
    }

    return (
      new Date(
        this.endsAt()
      ) <
      new Date(
        this.startsAt()
      )
    );
  }

  jsonInvalid(
    value: string
  ): boolean {

    if (
      !value.trim()
    ) {
      return false;
    }

    try {
      JSON.parse(
        value
      );

      return false;
    } catch {
      return true;
    }
  }

  isInvalid(): boolean {

    return (
      !this.name().trim() ||
      !this.key().trim() ||
      this.keyInvalid() ||
      this.rolloutInvalid() ||
      this.dateRangeInvalid() ||
      this.jsonInvalid(
        this.conditionsJson()
      ) ||
      this.jsonInvalid(
        this.metadataJson()
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
      key:
        this.key()
          .trim(),

      name:
        this.name()
          .trim(),

      description:
        this.optionalText(
          this.description()
        ),

      environment:
        this.environment(),

      isEnabled:
        this.isEnabled(),

      rolloutPercentage:
        Number(
          this.rolloutPercentage()
        ),

      startsAtUtc:
        this.toUtc(
          this.startsAt()
        ),

      endsAtUtc:
        this.toUtc(
          this.endsAt()
        ),

      conditionsJson:
        this.optionalText(
          this.conditionsJson()
        ),

      metadataJson:
        this.optionalText(
          this.metadataJson()
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

  private loadInitial(): void {

    const item =
      this.initialValue();

    if (
      !item
    ) {
      return;
    }

    this.key.set(
      item.key ??
      ''
    );

    this.name.set(
      item.name ??
      ''
    );

    this.description.set(
      item.description ??
      ''
    );

    this.environment.set(
      item.environment ??
      'All'
    );

    this.isEnabled.set(
      item.isEnabled ??
      false
    );

    this.rolloutPercentage.set(
      item.rolloutPercentage ??
      100
    );

    this.startsAt.set(
      this.toLocalInput(
        item.startsAtUtc
      )
    );

    this.endsAt.set(
      this.toLocalInput(
        item.endsAtUtc
      )
    );

    this.conditionsJson.set(
      item.conditionsJson ??
      ''
    );

    this.metadataJson.set(
      item.metadataJson ??
      ''
    );
  }

  private optionalText(
    value: string
  ): string | null {

    return value
      .trim() ||
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
