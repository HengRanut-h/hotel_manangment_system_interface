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

export interface ShiftFormValue {
  name: string;
  code: string;
  description: string | null;
  branchId: string | null;
  isActive: boolean;
}

@Component({
  selector: 'app-shift-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslationPipe
  ],
  templateUrl: './shift-form.component.html',
  styleUrl: './shift-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShiftFormComponent
  implements OnInit {

  readonly name =
    input(
      ''
    );

  readonly code =
    input(
      ''
    );

  readonly description =
    input<string | null>(
      null
    );

  readonly isActive =
    input(
      true
    );

  readonly showBranch =
    input(
      false
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
    output<ShiftFormValue>();

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

  readonly formDescription =
    signal(
      ''
    );

  readonly formBranchId =
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

    const description =
      this.formDescription()
        .trim();

    if (
      !name
      ||
      !code
      ||
      this.saving()
    ) {
      return;
    }

    this.submitted.emit({
      name,
      code,
      description:
        description || null,
      branchId:
        this.formBranchId()
          .trim()
        || null,
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
