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
  LucideArrowLeft,
  LucideUserRoundPlus
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
  GuestFormComponent
} from '../../components/guest-form/guest-form.component';

import {
  GuestsApiService
} from '../../data-access/guests-api.service';

import {
  GuestRequest
} from '../../models/guest.model';

@Component({
  selector: 'app-guest-create-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    GuestFormComponent,
    LucideArrowLeft,
    LucideUserRoundPlus
  ],
  templateUrl: './guest-create.page.html',
  styleUrl: './guest-create.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestCreatePage {
  private readonly api =
    inject(GuestsApiService);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly submitting =
    signal(false);

  create(
    request: GuestRequest
  ): void {
    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);

    this.api
      .create(request)
      .subscribe({
        next:
          guest => {
            this.submitting.set(false);

            this.toast.success(
              this.translation.translate(
                'guests.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/front-office/guests',
              guest.id
            ]);
          },

        error:
          error => {
            this.submitting.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'guests.createFailed'
                )
              )
            );
          }
      });
  }
}
