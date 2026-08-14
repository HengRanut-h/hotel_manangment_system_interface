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
  PositionFormComponent,
  PositionFormValue
} from '../../components/position-form/position-form.component';

import {
  PositionApiService
} from '../../data-access/position-api.service';

@Component({
  selector: 'app-position-create.page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    PositionFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './position-create.page.html',
  styleUrl: './position-create.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PositionCreatePage {

  private readonly api =
    inject(
      PositionApiService
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
    value: PositionFormValue
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
          position => {

            this.toast.success(
              this.translation.translate(
                'positions.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/hr/positions',
              position.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'positions.createFailed'
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
      '/app/hr/positions'
    ]);
  }

}
