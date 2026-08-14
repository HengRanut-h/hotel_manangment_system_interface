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

import {
  EmployeeLookupOption
} from '../../models/employee.model';

export interface EmployeeFormValue {
  employeeNumber: string;
  fullName: string;
  email: string | null;
  departmentId: string | null;
  positionId: string | null;
  branchId: string | null;
}

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslationPipe
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeFormComponent
  implements OnInit {

  readonly employeeNumber =
    input(
      ''
    );

  readonly fullName =
    input(
      ''
    );

  readonly email =
    input<string | null>(
      null
    );

  readonly departmentId =
    input<string | null>(
      null
    );

  readonly positionId =
    input<string | null>(
      null
    );

  readonly branchId =
    input<string | null>(
      null
    );

  readonly employeeNumberReadonly =
    input(
      false
    );

  readonly departments =
    input<EmployeeLookupOption[]>(
      []
    );

  readonly positions =
    input<EmployeeLookupOption[]>(
      []
    );

  readonly saving =
    input(
      false
    );

  readonly submitLabel =
    input(
      ''
    );

  readonly submitted =
    output<EmployeeFormValue>();

  readonly cancelled =
    output<void>();

  readonly formEmployeeNumber =
    signal(
      ''
    );

  readonly formFullName =
    signal(
      ''
    );

  readonly formEmail =
    signal(
      ''
    );

  readonly formDepartmentId =
    signal(
      ''
    );

  readonly formPositionId =
    signal(
      ''
    );

  readonly formBranchId =
    signal(
      ''
    );

  readonly touched =
    signal(
      false
    );

  ngOnInit(): void {

    this.formEmployeeNumber.set(
      this.employeeNumber()
    );

    this.formFullName.set(
      this.fullName()
    );

    this.formEmail.set(
      this.email() ?? ''
    );

    this.formDepartmentId.set(
      this.departmentId() ?? ''
    );

    this.formPositionId.set(
      this.positionId() ?? ''
    );

    this.formBranchId.set(
      this.branchId() ?? ''
    );
  }

  submit(): void {

    this.touched.set(
      true
    );

    const employeeNumber =
      this.formEmployeeNumber()
        .trim();

    const fullName =
      this.formFullName()
        .trim();

    const email =
      this.formEmail()
        .trim();

    if (
      !employeeNumber
      ||
      !fullName
      ||
      this.saving()
    ) {
      return;
    }

    this.submitted.emit({
      employeeNumber,
      fullName,
      email:
        email || null,
      departmentId:
        this.formDepartmentId()
          .trim()
        || null,
      positionId:
        this.formPositionId()
          .trim()
        || null,
      branchId:
        this.formBranchId()
          .trim()
        || null
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
