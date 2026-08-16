import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

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
  LucideSave,
  LucideZap
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  Utility,
  UtilityRequest
} from '../../models/utility.model';

import {
  UtilitiesApiService
} from '../../data-access/utilities-api.service';

@Component({
  selector:
    'app-utilities-create-page',

  standalone:
    true,

  imports: [
    FormsModule,
    RouterLink,
    TranslationPipe,
    LucideArrowLeft,
    LucideSave,
    LucideZap
  ],

  templateUrl:
    './utilities-create.page.html',

  styleUrl:
    './utilities-create.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityCreatePage {

  private readonly api =
    inject(UtilitiesApiService);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly submitting =
    signal(false);


readonly name = signal('');
readonly code = signal('');
readonly type = signal('Electricity');
readonly unit = signal('');
readonly description = signal('');
readonly isActive = signal(true);

buildRequest():
  UtilityRequest | null {

  if (
    !this.name().trim() ||
    !this.unit().trim()
  ) {
    return null;
  }

  return {
    name:
      this.name().trim(),

    code:
      this.code().trim() ||
      null,

    type:
      this.type(),

    unit:
      this.unit().trim(),

    description:
      this.description().trim() ||
      null,

    isActive:
      this.isActive()
  };
}

loadFrom(
  item: Utility
): void {

  this.name.set(
    item.name ??
    ''
  );

  this.code.set(
    item.code ??
    ''
  );

  this.type.set(
    item.type ??
    'Electricity'
  );

  this.unit.set(
    item.unit ??
    ''
  );

  this.description.set(
    item.description ??
    ''
  );

  this.isActive.set(
    item.isActive ??
    true
  );
}


  save(): void {

    const request =
      this.buildRequest();

    if (
      !request
    ) {
      return;
    }

    this.submitting.set(
      true
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
          item =>
            this.router.navigate(
              [
                '/app/finance/utility-billing/utilities',
                item.id
              ]
            ),

        error:
          error =>
            console.error(
              'Create Utility error',
              error
            )
      });
  }
}
