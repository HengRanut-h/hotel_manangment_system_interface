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
  FloorFormComponent,
  FloorFormValue
} from '../../components/floor-form/floor-form.component';

import {
  FloorApiService
} from '../../data-access/floor-api.service';

@Component({
  selector: 'app-floor-create-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    FloorFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './floor-create.page.html',
  styleUrl: './floor-create.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloorCreatePage {

  private readonly api =
    inject(
      FloorApiService
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
    value: FloorFormValue
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
          value.description
      })
      .subscribe({
        next:
          floor => {

            this.toast.success(
              this.translation.translate(
                'floors.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/property/floors',
              floor.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'floors.createFailed'
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
      '/app/property/floors'
    ]);
  }

}
