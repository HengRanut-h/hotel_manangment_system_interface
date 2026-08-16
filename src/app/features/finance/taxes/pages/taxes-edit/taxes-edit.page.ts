import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  finalize
} from 'rxjs';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  LucideArrowLeft,
  LucidePencil
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  Tax,
  TaxUpsertRequest
} from '../../models/tax.model';

import {
  TaxesApiService
} from '../../data-access/taxes-api.service';

import {
  TaxFormComponent
} from '../../components/tax-form/tax-form.component';

@Component({
  selector:
    'app-taxes-edit-page',

  standalone:
    true,

  imports: [
    RouterLink,
    TranslationPipe,
    TaxFormComponent,
    LucideArrowLeft,
    LucidePencil
  ],

  templateUrl:
    './taxes-edit.page.html',

  styleUrl:
    './taxes-edit.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class TaxesEditPage {

  private readonly api =
    inject(TaxesApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly tax =
    signal<Tax | null>(
      null
    );

  readonly loading =
    signal(false);

  readonly submitting =
    signal(false);

  readonly errorKey =
    signal<string | null>(
      null
    );

  readonly id =
    this.route
      .snapshot
      .paramMap
      .get(
        'id'
      );

  constructor() {

    if (
      !this.id
    ) {
      this.errorKey.set(
        'taxes.errors.missingId'
      );

      return;
    }

    this.load();
  }

  load(): void {

    if (
      !this.id
    ) {
      return;
    }

    this.loading.set(
      true
    );

    this.api
      .getById(
        this.id
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.loading.set(
              false
            )
        )
      )
      .subscribe({
        next:
          value =>
            this.tax.set(
              value
            ),

        error:
          error => {

            console.error(
              'Load tax for edit error',
              error
            );

            this.errorKey.set(
              'taxes.errors.loadDetail'
            );
          }
      });
  }

  update(
    request:
      TaxUpsertRequest
  ): void {

    if (
      !this.id ||
      this.submitting()
    ) {
      return;
    }

    this.submitting.set(
      true
    );

    this.errorKey.set(
      null
    );

    this.api
      .update(
        this.id,
        request
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),

        finalize(
          () =>
            this.submitting.set(
              false
            )
        )
      )
      .subscribe({
        next:
          () =>
            this.router.navigate(
              [
                '/app/finance/taxes',
                this.id
              ]
            ),

        error:
          error => {

            console.error(
              'Update tax API error',
              error
            );

            this.errorKey.set(
              'taxes.errors.update'
            );
          }
      });
  }

  cancel(): void {

    if (
      this.id
    ) {
      this.router.navigate(
        [
          '/app/finance/taxes',
          this.id
        ]
      );
    }
  }
}
