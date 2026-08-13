import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  LucideCheck,
  LucideMail,
  LucideMapPin,
  LucideShieldCheck,
  LucideUser,
  LucideX
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

@Component({
  selector: 'app-user-form',
  standalone: true,

  imports: [
    FormsModule,
    TranslationPipe,
    SpinComponent,

    LucideCheck,
    LucideMail,
    LucideMapPin,
    LucideShieldCheck,
    LucideUser,
    LucideX
  ],

  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UserFormComponent {

  readonly fullName = model('');
  readonly email = model('');
  readonly branchId = model<string | null>(null);
  readonly isActive = model(true);
  readonly roleNames = model<string[]>([]);

  readonly availableRoles =
    input<string[]>([]);

  readonly saving =
    input(false);

  readonly showStatus =
    input(true);

  readonly submitLabel =
    input('common.save');

  readonly submitted =
    output<void>();

  readonly cancelled =
    output<void>();

  readonly valid =
    computed(() =>
      this.fullName().trim().length > 0
      &&
      this.email().trim().length > 0
      &&
      this.isValidEmail(this.email())
    );

  toggleRole(
    roleName: string
  ): void {

    if (this.saving()) {
      return;
    }

    this.roleNames.update(current =>
      current.includes(roleName)
        ? current.filter(item => item !== roleName)
        : [...current, roleName]
    );
  }

  hasRole(
    roleName: string
  ): boolean {

    return this.roleNames()
      .includes(roleName);
  }

  submit(): void {

    if (
      !this.valid()
      ||
      this.saving()
    ) {
      return;
    }

    this.fullName.set(
      this.fullName().trim()
    );

    this.email.set(
      this.email().trim().toLowerCase()
    );

    this.branchId.set(
      this.branchId()?.trim() || null
    );

    this.submitted.emit();
  }

  cancel(): void {

    if (this.saving()) {
      return;
    }

    this.cancelled.emit();
  }

  private isValidEmail(
    value: string
  ): boolean {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(value.trim());
  }
}
