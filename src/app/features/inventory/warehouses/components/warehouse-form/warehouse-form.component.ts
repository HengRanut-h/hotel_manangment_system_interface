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
  LucideCheck,
  LucideWarehouse
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

export interface WarehouseFormValue {
  branchId: string | null;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
}

@Component({
  selector:
    'app-warehouse-form',

  standalone:
    true,

  imports: [
    TranslationPipe,
    LucideCheck,
    LucideWarehouse
  ],

  templateUrl:
    './warehouse-form.component.html',

  styleUrl:
    './warehouse-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class WarehouseFormComponent
  implements OnChanges {

  readonly initialBranchId =
    input<string | null>(null);

  readonly initialName =
    input('');

  readonly initialCode =
    input('');

  readonly initialDescription =
    input<string | null>(null);

  readonly initialIsActive =
    input(true);

  readonly showStatus =
    input(false);

  readonly submitting =
    input(false);

  readonly submitted =
    output<WarehouseFormValue>();

  readonly cancelled =
    output<void>();

  readonly name =
    signal('');

  readonly code =
    signal('');

  readonly description =
    signal('');

  readonly isActive =
    signal(true);

  readonly touched =
    signal(false);

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      changes['initialName']
    ) {
      this.name.set(
        this.initialName()
      );
    }

    if (
      changes['initialCode']
    ) {
      this.code.set(
        this.initialCode()
      );
    }

    if (
      changes['initialDescription']
    ) {
      this.description.set(
        this.initialDescription()
        ??
        ''
      );
    }

    if (
      changes['initialIsActive']
    ) {
      this.isActive.set(
        this.initialIsActive()
      );
    }
  }

  setName(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.name.set(
      target.value
    );
  }

  setCode(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.code.set(
      target.value
        .toUpperCase()
    );
  }

  setDescription(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLTextAreaElement)
    ) {
      return;
    }

    this.description.set(
      target.value
    );
  }

  setStatus(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      !(target instanceof HTMLInputElement)
    ) {
      return;
    }

    this.isActive.set(
      target.checked
    );
  }

  isInvalid(): boolean {

    return (
      this.touched()
      &&
      (
        !this.name()
          .trim()
        ||
        !this.code()
          .trim()
      )
    );
  }

  submit(): void {

    this.touched.set(true);

    const name =
      this.name()
        .trim();

    const code =
      this.code()
        .trim()
        .toUpperCase();

    const description =
      this.description()
        .trim();

    if (
      !name
      ||
      !code
      ||
      this.submitting()
    ) {
      return;
    }

    this.submitted.emit({
      branchId:
        this.initialBranchId(),
      name,
      code,
      description:
        description
          ? description
          : null,
      isActive:
        this.isActive()
    });
  }

  cancel(): void {

    if (
      this.submitting()
    ) {
      return;
    }

    this.cancelled.emit();
  }
}
