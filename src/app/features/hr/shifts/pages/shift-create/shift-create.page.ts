import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft
} from '@lucide/angular';

import {
  getSafeApiErrorMessage
} from '../../../../../core/http/api-error.util';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  TranslationService
} from '../../../../../core/i18n/translation.service';

import {
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  ShiftFormComponent,
  ShiftFormValue
} from '../../components/shift-form/shift-form.component';

import {
  ShiftApiService
} from '../../data-access/shift-api.service';

@Component({
  selector: 'app-shift-create.page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    ShiftFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './shift-create.page.html',
  styleUrl: './shift-create.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShiftCreatePage {

  private readonly api =
    inject(
      ShiftApiService
    );

  private readonly router =
    inject(
      Router
    );

  private readonly toast =
    inject(
      ToastService
    );

  private readonly translation =
    inject(
      TranslationService
    );

  readonly saving =
    signal(
      false
    );

  save(
    value: ShiftFormValue
  ): void {

    if (
      this.saving()
    ) {
      return;
    }

    this.saving.set(
      true
    );

    this.api
      .create({
        name:
          value.name,
        code:
          value.code,
        description:
          value.description,
        branchId:
          value.branchId
      })
      .subscribe({
        next:
          shift => {

            this.toast.success(
              this.translation.translate(
                'shifts.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/hr/shifts',
              shift.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'shifts.createFailed'
                )
              )
            );

            this.saving.set(
              false
            );
          }
      });
  }

  cancel(): void {

    void this.router.navigate([
      '/app/hr/shifts'
    ]);
  }

}
