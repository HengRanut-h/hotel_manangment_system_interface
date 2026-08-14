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
  PositionFormComponent,
  PositionFormValue
} from '../../components/position-form/position-form.component';

import {
  PositionApiService
} from '../../data-access/position-api.service';

import {
  Position
} from '../../models/position.model';

@Component({
  selector: 'app-position-edit.page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    SpinComponent,
    PositionFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './position-edit.page.html',
  styleUrl: './position-edit.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PositionEditPage
  implements OnInit {

  private readonly api =
    inject(
      PositionApiService
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

  readonly position =
    signal<Position | null>(
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
          'positions.missingId'
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
          position => {

            this.position.set(
              position
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
                  'positions.loadOneFailed'
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
    value: PositionFormValue
  ): void {

    const position =
      this.position();

    if (
      !position
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
        position.id,
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
                'positions.updateSuccess'
              )
            );

            void this.router.navigate([
              '/app/hr/positions',
              updated.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'positions.updateFailed'
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

    const position =
      this.position();

    void this.router.navigate(
      position
        ? [
          '/app/hr/positions',
          position.id
        ]
        : [
          '/app/hr/positions'
        ]
    );
  }

}
