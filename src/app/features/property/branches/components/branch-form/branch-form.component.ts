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

export interface BranchFormValue {
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
}

@Component({
  selector: 'app-branch-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslationPipe
  ],
  templateUrl: './branch-form.component.html',
  styleUrl: './branch-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BranchFormComponent
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
    output<BranchFormValue>();

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
