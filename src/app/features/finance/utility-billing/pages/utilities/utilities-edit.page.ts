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
    'app-utilities-edit-page',

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
    './utilities-edit.page.html',

  styleUrl:
    './utilities-edit.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class UtilityEditPage {

  private readonly api =
    inject(UtilitiesApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly loading =
    signal(false);

  readonly submitting =
    signal(false);

  readonly id =
    this.route.snapshot.paramMap.get(
      'id'
    );


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


  constructor() {

    if (
      this.id
    ) {
      this.load();
    }
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
          item =>
            this.loadFrom(
              item
            ),

        error:
          error =>
            console.error(
              'Load Utility error',
              error
            )
      });
  }

  save(): void {

    if (
      !this.id
    ) {
      return;
    }

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
                '/app/finance/utility-billing/utilities',
                this.id
              ]
            ),

        error:
          error =>
            console.error(
              'Update Utility error',
              error
            )
      });
  }
}
