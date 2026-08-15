import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

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
  LaundryFormComponent,
  LaundryFormValue
} from '../../components/laundry-form/laundry-form.component';

import {
  LaundryApiService
} from '../../data-access/laundry-api.service';

import {
  LaundryRequest
} from '../../models/laundry.model';

@Component({
  selector:
    'app-laundry-edit-page',

  standalone:
    true,

  imports: [
    TranslationPipe,
    SpinComponent,
    LaundryFormComponent
  ],

  templateUrl:
    './laundry-edit.page.html',

  styleUrl:
    './laundry-edit.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class LaundryEditPage
  implements OnInit {

  private readonly api =
    inject(LaundryApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly toast =
    inject(ToastService);

  private readonly translation =
    inject(TranslationService);

  readonly item =
    signal<LaundryRequest | null>(null);

  readonly loading =
    signal(true);

  readonly submitting =
    signal(false);

  readonly errorMessage =
    signal('');

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    const id =
      this.route.snapshot.paramMap
        .get('id');

    if (!id) {
      this.loading.set(false);

      this.errorMessage.set(
        this.translation.translate(
          'laundry.missingId'
        )
      );

      return;
    }

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
                  'laundry.loadOneFailed'
                )
              )
            );

            this.loading.set(false);
          }
      });
  }

  submit(
    value: LaundryFormValue
  ): void {

    const item =
      this.item();

    if (
      !item
      ||
      this.submitting()
    ) {
      return;
    }

    this.submitting.set(true);

    this.api
      .update(
        item.id,
        {
          branchId:
            value.branchId,

          title:
            value.title,

          notes:
            value.notes,

          amount:
            value.amount,

          eventAtUtc:
            value.eventAtUtc,

          relatedEntityId:
            value.relatedEntityId,

          relatedEntityType:
            value.relatedEntityType
        }
      )
      .subscribe({

        next:
          updated => {

            this.submitting.set(false);

            this.toast.success(
              this.translation.translate(
                'laundry.updateSuccess'
              )
            );

            void this.router.navigate([
              '/app/operations/laundry',
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
                  'laundry.updateFailed'
                )
              )
            );
          }
      });
  }

  cancel(): void {

    const item =
      this.item();

    void this.router.navigate(
      item
        ? [
            '/app/operations/laundry',
            item.id
          ]
        : [
            '/app/operations/laundry'
          ]
    );
  }
}
