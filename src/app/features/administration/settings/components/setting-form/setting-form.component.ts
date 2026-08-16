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
  LucideSettings,
  LucideSave,
  LucideX
} from '@lucide/angular';

import {
  SettingItem,
  SettingUpsertRequest
} from '../../models/setting.model';

@Component({
  selector:
    'app-setting-form',

  standalone:
    true,

  imports: [
    FormsModule,
    LucideSettings,
    LucideSave,
    LucideX
  ],

  templateUrl:
    './setting-form.component.html',

  styleUrl:
    './setting-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class SettingFormComponent
  implements OnChanges {

  readonly initialValue =
    input<SettingItem | null>(
      null
    );

  readonly submitting =
    input(false);

  readonly submitLabel =
    input('Save Setting');

  readonly submitted =
    output<SettingUpsertRequest>();

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

  readonly category =
    signal('General');

  readonly valueType =
    signal('String');

  readonly value =
    signal('');

  readonly defaultValue =
    signal('');

  readonly isSensitive =
    signal(false);

  readonly isReadOnly =
    signal(false);

  readonly isSystem =
    signal(false);

  readonly isActive =
    signal(true);

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

  valueInvalid(): boolean {

    const raw =
      this.value()
        .trim();

    if (
      this.valueType() === 'Number'
    ) {
      return (
        raw !== '' &&
        !Number.isFinite(
          Number(
            raw
          )
        )
      );
    }

    if (
      this.valueType() === 'Boolean'
    ) {
      return ![
        '',
        'true',
        'false'
      ].includes(
        raw.toLowerCase()
      );
    }

    if (
      this.valueType() === 'Json' &&
      raw
    ) {
      try {
        JSON.parse(
          raw
        );

        return false;
      } catch {
        return true;
      }
    }

    return false;
  }

  defaultInvalid(): boolean {

    const raw =
      this.defaultValue()
        .trim();

    if (
      !raw
    ) {
      return false;
    }

    if (
      this.valueType() === 'Number'
    ) {
      return !Number.isFinite(
        Number(
          raw
        )
      );
    }

    if (
      this.valueType() === 'Boolean'
    ) {
      return ![
        'true',
        'false'
      ].includes(
        raw.toLowerCase()
      );
    }

    if (
      this.valueType() === 'Json'
    ) {
      try {
        JSON.parse(
          raw
        );

        return false;
      } catch {
        return true;
      }
    }

    return false;
  }

  isInvalid(): boolean {

    return (
      !this.key().trim() ||
      !this.name().trim() ||
      this.keyInvalid() ||
      this.valueInvalid() ||
      this.defaultInvalid()
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
        this.optional(
          this.description()
        ),

      category:
        this.category(),

      valueType:
        this.valueType(),

      value:
        this.optional(
          this.value()
        ),

      defaultValue:
        this.optional(
          this.defaultValue()
        ),

      isSensitive:
        this.isSensitive(),

      isReadOnly:
        this.isReadOnly(),

      isSystem:
        this.isSystem(),

      isActive:
        this.isActive()
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

    this.category.set(
      item.category ??
      'General'
    );

    this.valueType.set(
      item.valueType ??
      'String'
    );

    this.value.set(
      item.value ??
      ''
    );

    this.defaultValue.set(
      item.defaultValue ??
      ''
    );

    this.isSensitive.set(
      item.isSensitive ??
      false
    );

    this.isReadOnly.set(
      item.isReadOnly ??
      false
    );

    this.isSystem.set(
      item.isSystem ??
      false
    );

    this.isActive.set(
      item.isActive ??
      true
    );
  }

  private optional(
    value: string
  ): string | null {

    return value
      .trim() ||
      null;
  }
}
