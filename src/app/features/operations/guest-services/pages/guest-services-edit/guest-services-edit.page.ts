import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
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
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

import {
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  GuestServiceFormComponent,
  GuestServiceFormValue
} from '../../components/guest-service-form/guest-service-form.component';

import {
  GuestServicesApiService
} from '../../data-access/guest-services-api.service';

import {
  GuestService
} from '../../models/guest-services.model';

@Component({
  selector:
    'app-guest-services-edit-page',

  standalone:
    true,

  imports: [
    RouterLink,
    TranslationPipe,
    SpinComponent,
    GuestServiceFormComponent,
    LucideArrowLeft
  ],

  templateUrl:
    './guest-services-edit.page.html',

  styleUrl:
    './guest-services-edit.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class GuestServicesEditPage
  implements OnInit {

  private readonly api =
    inject(GuestServicesApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly item =
    signal<GuestService | null>(null);

  readonly loading =
    signal(true);

  readonly submitting =
    signal(false);

  readonly errorMessage =
    signal('');

  ngOnInit(): void {

    const id =
      this.route.snapshot
        .paramMap
        .get('id');

    if (!id) {
      this.errorMessage.set(
        this.translation.translate(
          'guestServices.missingId'
        )
      );
      this.loading.set(false);
      return;
    }

    this.load(id);
  }

  load(
    id: string
  ): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getById(id)
      .subscribe({

        next:
          item => {
            this.item.set(item);
            this.loading.set(false);
          },

        error:
          error => {
            this.errorMessage.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'guestServices.loadOneFailed'
                )
              )
            );
            this.loading.set(false);
          }
      });
  }

  save(
    value: GuestServiceFormValue
  ): void {

    const current =
      this.item();

    if (
      !current
      ||
      this.submitting()
    ) {
      return;
    }

    this.submitting.set(true);

    this.api
      .update(
        current.id,
        {
          branchId:
            value.branchId,
          name:
            value.name,
          code:
            value.code,
          description:
            value.description,
          isActive:
            value.isActive
        }
      )
      .subscribe({

        next:
          updated => {

            this.submitting.set(false);
            this.item.set(updated);

            this.toast.success(
              this.translation.translate(
                'guestServices.updateSuccess'
              )
            );

            void this.router.navigate([
              '/app/operations/services',
              updated.id
            ]);
          },

        error:
          error => {

            this.submitting.set(false);

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'guestServices.updateFailed'
                )
              )
            );
          }
      });
  }

  cancel(): void {

    const current =
      this.item();

    void this.router.navigate(
      current
        ? [
            '/app/operations/services',
            current.id
          ]
        : [
            '/app/operations/services'
          ]
    );
  }
}
