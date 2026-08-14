import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

export interface RoomTypeFormValue {
  name: string;
  code: string;
  baseRate: number;
  maxAdults: number;
  maxChildren: number;
  description: string | null;
  isActive: boolean;
}

@Component({
  selector: 'app-room-type-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslationPipe
  ],
  templateUrl: './room-type-form.component.html',
  styleUrl: './room-type-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomTypeFormComponent
  implements OnInit {

  readonly name =
    input(
      ''
    );

  readonly code =
    input(
      ''
    );

  readonly baseRate =
    input(
      0
    );

  readonly maxAdults =
    input(
      2
    );

  readonly maxChildren =
    input(
      0
    );

  readonly description =
    input<string | null>(
      null
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

  readonly submitted =
    output<RoomTypeFormValue>();

  readonly cancelled =
    output<void>();

  readonly formName =
    signal(
      ''
    );

  readonly formCode =
    signal(
      ''
    );

  readonly formBaseRate =
    signal(
      0
    );

  readonly formMaxAdults =
    signal(
      2
    );

  readonly formMaxChildren =
    signal(
      0
    );

  readonly formDescription =
    signal(
      ''
    );

  readonly formIsActive =
    signal(
      true
    );

  readonly touched =
    signal(
      false
    );

  ngOnInit(): void {

    this.formName.set(
      this.name()
    );

    this.formCode.set(
      this.code()
    );

    this.formBaseRate.set(
      this.baseRate()
    );

    this.formMaxAdults.set(
      this.maxAdults()
    );

    this.formMaxChildren.set(
      this.maxChildren()
    );

    this.formDescription.set(
      this.description() ?? ''
    );

    this.formIsActive.set(
      this.isActive()
    );
  }

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

    const baseRate =
      Number(
        this.formBaseRate()
      );

    const maxAdults =
      Number(
        this.formMaxAdults()
      );

    const maxChildren =
      Number(
        this.formMaxChildren()
      );

    const description =
      this.formDescription()
        .trim();

    if (
      !name
      ||
      !code
      ||
      Number.isNaN(
        baseRate
      )
      ||
      baseRate < 0
      ||
      Number.isNaN(
        maxAdults
      )
      ||
      maxAdults < 1
      ||
      Number.isNaN(
        maxChildren
      )
      ||
      maxChildren < 0
      ||
      this.saving()
    ) {
      return;
    }

    this.submitted.emit({
      name,
      code,
      baseRate,
      maxAdults,
      maxChildren,
      description:
        description || null,
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
