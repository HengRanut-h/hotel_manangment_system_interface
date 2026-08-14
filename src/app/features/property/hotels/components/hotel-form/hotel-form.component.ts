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
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';


export interface HotelFormValue {
  name: string;

  code: string;

  currency: string;

  isActive: boolean;
}


@Component({
  selector:
    'app-hotel-form',

  standalone:
    true,

  imports: [
    FormsModule,
    TranslationPipe
  ],

  templateUrl:
    './hotel-form.component.html',

  styleUrl:
    './hotel-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class HotelFormComponent {

  // =========================================================
  // INPUT
  // =========================================================

  readonly name =
    input(
      ''
    );

  readonly code =
    input(
      ''
    );

  readonly currency =
    input(
      'USD'
    );

  readonly isActive =
    input(
      true
    );

  readonly saving =
    input(
      false
    );

  readonly showStatus =
    input(
      false
    );

  readonly submitLabel =
    input(
      ''
    );


  // =========================================================
  // OUTPUT
  // =========================================================

  readonly submitted =
    output<HotelFormValue>();

  readonly cancelled =
    output<void>();


  // =========================================================
  // LOCAL STATE
  // =========================================================

  readonly formName =
    signal(
      ''
    );

  readonly formCode =
    signal(
      ''
    );

  readonly formCurrency =
    signal(
      'USD'
    );

  readonly formIsActive =
    signal(
      true
    );

  readonly touched =
    signal(
      false
    );


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.formName.set(
      this.name()
    );

    this.formCode.set(
      this.code()
    );

    this.formCurrency.set(
      this.currency()
    );

    this.formIsActive.set(
      this.isActive()
    );

  }


  // =========================================================
  // SUBMIT
  // =========================================================

  submit(): void {

    this.touched.set(
      true
    );


    const name =
      this.formName()
        .trim();

    const code =
      this.formCode()
        .trim();

    const currency =
      this.formCurrency()
        .trim()
        .toUpperCase();


    if (
      !name
      ||
      !code
      ||
      !currency
      ||
      this.saving()
    ) {
      return;
    }


    this.submitted.emit({
      name,
      code,
      currency,
      isActive:
        this.formIsActive()
    });

  }


  cancel(): void {

    if (
      this.saving()
    ) {
      return;
    }


    this.cancelled.emit();

  }

}
