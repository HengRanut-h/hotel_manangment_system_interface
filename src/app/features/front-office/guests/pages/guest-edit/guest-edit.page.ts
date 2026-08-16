import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft,
  LucidePencil,
  LucideRefreshCw
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
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

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
  Guest,
  GuestRequest
} from '../../models/guest.model';

@Component({
  selector: 'app-guest-edit-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    SpinComponent,
    GuestFormComponent,
    LucideArrowLeft,
    LucidePencil,
    LucideRefreshCw
  ],
  templateUrl: './guest-edit.page.html',
  styleUrl: './guest-edit.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestEditPage
  implements OnInit {

  private readonly api =
    inject(GuestsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly guest =
    signal<Guest | null>(null);

  readonly loading =
    signal(true);

  readonly submitting =
    signal(false);

  readonly errorMessage =
    signal('');

  private id = '';

  ngOnInit(): void {
    this.id =
      this.route.snapshot
        .paramMap
        .get('id')
      ??
      '';

    if (!this.id) {
      this.loading.set(false);
      this.errorMessage.set(
        this.translation.translate(
          'guests.invalidGuestId'
        )
      );
      return;
    }

    this.load();
  }

  load(): void {
    if (!this.id) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getById(this.id)
      .subscribe({
        next:
          guest => {
            this.guest.set(guest);
            this.loading.set(false);
          },

        error:
          error => {
            this.guest.set(null);

            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'guests.detailLoadFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }

  update(
    request: GuestRequest
  ): void {
    if (
      this.submitting()
      ||
      !this.id
    ) {
      return;
    }

    this.submitting.set(true);

    this.api
      .update(
        this.id,
        request
      )
      .subscribe({
        next:
          guest => {
            this.submitting.set(false);

            this.toast.success(
              this.translation.translate(
                'guests.updateSuccess'
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
                  'guests.updateFailed'
                )
              )
            );
          }
      });
  }
}
