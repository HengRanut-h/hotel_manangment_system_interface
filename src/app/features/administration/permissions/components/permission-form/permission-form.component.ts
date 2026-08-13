import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal
} from '@angular/core';

import {
  LucideCheck,
  LucideShield,
  LucideX
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

export interface PermissionFormValue {
  name: string;
}

@Component({
  selector: 'app-permission-form',
  standalone: true,
  imports: [
    TranslationPipe,
    SpinComponent,
    LucideCheck,
    LucideShield,
    LucideX
  ],
  templateUrl: './permission-form.component.html',
  styleUrl: './permission-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionFormComponent {
  readonly initialName = input('');
  readonly submitting = input(false);
  readonly submitLabel = input('permissions.save');
  readonly disabled = input(false);

  readonly submitted = output<PermissionFormValue>();
  readonly cancelled = output<void>();

  readonly name = signal('');
  readonly touched = signal(false);

  readonly normalizedName = computed(() =>
    this.name().trim().toLowerCase()
  );

  readonly validationMessage = computed(() => {
    const name = this.name().trim();

    if (!name) {
      return 'Permission name is required.';
    }

    if (name.length < 3) {
      return 'Permission name must contain at least 3 characters.';
    }

    if (name.length > 150) {
      return 'Permission name cannot exceed 150 characters.';
    }

    if (!/^[a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*$/.test(name)) {
      return 'Use letters, numbers, dots, and hyphens only.';
    }

    return '';
  });

  constructor() {
    effect(() => {
      this.name.set(this.initialName());
      this.touched.set(false);
    });
  }

  setName(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.name.set(inputElement.value);
  }

  isInvalid(): boolean {
    return this.touched() && !!this.validationMessage();
  }

  submit(): void {
    this.touched.set(true);

    if (
      this.validationMessage()
      || this.submitting()
      || this.disabled()
    ) {
      return;
    }

    this.submitted.emit({
      name: this.normalizedName()
    });
  }

  cancel(): void {
    if (this.submitting()) {
      return;
    }

    this.cancelled.emit();
  }
}
