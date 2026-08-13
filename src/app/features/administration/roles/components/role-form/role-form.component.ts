import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideCheck, LucideX } from '@lucide/angular';

import { TranslationPipe } from '../../../../../core/i18n/translation.pipe';
import { SpinComponent } from '../../../../../shared/ui/spin/spin.component';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslationPipe,
    SpinComponent,
    LucideCheck,
    LucideX
  ],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleFormComponent {
  readonly name = model('');
  readonly saving = input(false);
  readonly submitLabel = input('roles.update');

  readonly submitted = output<void>();
  readonly cancelled = output<void>();

  submit(): void {
    const roleName = this.name().trim();

    if (!roleName || this.saving()) {
      return;
    }

    this.name.set(roleName);
    this.submitted.emit();
  }

  cancel(): void {
    if (this.saving()) {
      return;
    }

    this.cancelled.emit();
  }
}
