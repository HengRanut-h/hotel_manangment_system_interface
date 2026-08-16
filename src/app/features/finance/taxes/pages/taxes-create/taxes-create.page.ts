import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
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
  LucidePlus
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
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
    'app-taxes-create-page',

  standalone:
    true,

  imports: [
    RouterLink,
    TranslationPipe,
    TaxFormComponent,
    LucideArrowLeft,
    LucidePlus
  ],

  templateUrl:
    './taxes-create.page.html',

  styleUrl:
    './taxes-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class TaxesCreatePage {

  private readonly api =
    inject(TaxesApiService);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly submitting =
    signal(false);

  readonly errorKey =
    signal<string | null>(
      null
    );

  create(
    request:
      TaxUpsertRequest
  ): void {

    if (
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
      .create(
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
          tax =>
            this.router.navigate(
              [
                '/app/finance/taxes',
                tax.id
              ]
            ),

        error:
          error => {

            console.error(
              'Create tax API error',
              error
            );

            this.errorKey.set(
              'taxes.errors.create'
            );
          }
      });
  }

  cancel(): void {

    this.router.navigate(
      [
        '/app/finance/taxes'
      ]
    );
  }
}
