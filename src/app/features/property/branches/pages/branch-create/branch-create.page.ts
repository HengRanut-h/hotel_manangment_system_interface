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
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  BranchFormComponent,
  BranchFormValue
} from '../../components/branch-form/branch-form.component';

import {
  BranchApiService
} from '../../data-access/branch-api.service';

@Component({
  selector: 'app-branch-create-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    BranchFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './branch-create.page.html',
  styleUrl: './branch-create.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BranchCreatePage {

  private readonly api =
    inject(
      BranchApiService
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

  readonly saving =
    signal(
      false
    );

  save(
    value: BranchFormValue
  ): void {

    if (
      this.saving()
    ) {
      return;
    }

    this.saving.set(
      true
    );

    this.api
      .create({
        name:
          value.name,
        code:
          value.code,
        description:
          value.description
      })
      .subscribe({
        next:
          branch => {

            this.toast.success(
              this.translation.translate(
                'branches.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/property/branches',
              branch.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'branches.createFailed'
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

    void this.router.navigate([
      '/app/property/branches'
    ]);
  }

}
