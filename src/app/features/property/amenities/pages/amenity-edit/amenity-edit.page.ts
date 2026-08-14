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
  AmenityFormComponent,
  AmenityFormValue
} from '../../components/amenity-form/amenity-form.component';

import {
  AmenityApiService
} from '../../data-access/amenity-api.service';

import {
  Amenity
} from '../../models/amenity.model';

@Component({
  selector: 'app-amenity-edit-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    SpinComponent,
    AmenityFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './amenity-edit.page.html',
  styleUrl: './amenity-edit.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmenityEditPage
  implements OnInit {

  private readonly api =
    inject(
      AmenityApiService
    );

  private readonly route =
    inject(
      ActivatedRoute
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

  readonly amenity =
    signal<Amenity | null>(
      null
    );

  readonly loading =
    signal(
      true
    );

  readonly saving =
    signal(
      false
    );

  readonly error =
    signal(
      ''
    );

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    const id =
      this.route
        .snapshot
        .paramMap
        .get(
          'id'
        );

    if (!id) {
      this.error.set(
        this.translation.translate(
          'amenities.missingId'
        )
      );
      this.loading.set(
        false
      );
      return;
    }

    this.loading.set(
      true
    );

    this.error.set(
      ''
    );

    this.api
      .getById(
        id
      )
      .subscribe({
        next:
          amenity => {

            this.amenity.set(
              amenity
            );

            this.loading.set(
              false
            );
          },
        error:
          error => {

            this.error.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'amenities.loadOneFailed'
                )
              )
            );

            this.loading.set(
              false
            );
          }
      });
  }

  save(
    value: AmenityFormValue
  ): void {

    const amenity =
      this.amenity();

    if (
      !amenity
      ||
      this.saving()
    ) {
      return;
    }

    this.saving.set(
      true
    );

    this.api
      .update(
        amenity.id,
        {
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

            this.toast.success(
              this.translation.translate(
                'amenities.updateSuccess'
              )
            );

            void this.router.navigate([
              '/app/property/amenities',
              updated.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'amenities.updateFailed'
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

    const amenity =
      this.amenity();

    void this.router.navigate(
      amenity
        ? [
          '/app/property/amenities',
          amenity.id
        ]
        : [
          '/app/property/amenities'
        ]
    );
  }

}
