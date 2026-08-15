import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  LucideCheck,
  LucideX
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

import {
  GuestService
} from '../../models/guest-services.model';

export interface GuestServiceFormValue {
  branchId: string | null;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
}

@Component({
  selector:
    'app-guest-service-form',

  standalone:
    true,

  imports: [
    ReactiveFormsModule,
    TranslationPipe,
    SpinComponent,

    LucideCheck,
    LucideX
  ],

  templateUrl:
    './guest-service-form.component.html',

  styleUrl:
    './guest-service-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class GuestServiceFormComponent {

  readonly initialValue =
    input<GuestService | null>(null);

  readonly submitting =
    input(false);

  readonly showStatus =
    input(true);

  readonly submitLabel =
    input('guestServices.save');

  readonly submitted =
    output<GuestServiceFormValue>();

  readonly cancelled =
    output<void>();

  readonly form =
    new FormGroup({

      name:
        new FormControl(
          '',
          {
            nonNullable: true,
            validators: [
              Validators.required,
              Validators.maxLength(200)
            ]
          }
        ),

      code:
        new FormControl(
          '',
          {
            nonNullable: true,
            validators: [
              Validators.required,
              Validators.maxLength(100)
            ]
          }
        ),

      description:
        new FormControl<string | null>(
          null,
          {
            validators: [
              Validators.maxLength(1000)
            ]
          }
        ),

      isActive:
        new FormControl(
          true,
          {
            nonNullable: true
          }
        )
    });

  constructor() {

    effect(() => {

      const value =
        this.initialValue();

      this.form.reset({
        name:
          value?.name ?? '',
        code:
          value?.code ?? '',
        description:
          value?.description ?? null,
        isActive:
          value?.isActive ?? true
      });
    });
  }

  submit(): void {

    if (
      this.submitting()
      ||
      this.form.invalid
    ) {
      this.form.markAllAsTouched();
      return;
    }

    const value =
      this.form.getRawValue();

    this.submitted.emit({
      branchId:
        this.initialValue()
          ?.branchId
        ?? null,

      name:
        value.name.trim(),

      code:
        value.code
          .trim()
          .toUpperCase(),

      description:
        this.normalizeOptional(
          value.description
        ),

      isActive:
        value.isActive
    });
  }

  cancel(): void {

    if (this.submitting()) {
      return;
    }

    this.cancelled.emit();
  }

  private normalizeOptional(
    value: string | null
  ): string | null {

    const normalized =
      value?.trim();

    return normalized
      ? normalized
      : null;
  }
}
