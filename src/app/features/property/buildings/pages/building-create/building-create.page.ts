import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
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
  BuildingFormComponent,
  BuildingFormValue
} from '../../components/building-form/building-form.component';

import {
  BuildingApiService
} from '../../data-access/building-api.service';

import {
  BuildingBranchOption
} from '../../models/building.model';

@Component({
  selector: 'app-building-create-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslationPipe,
    BuildingFormComponent,
    LucideArrowLeft
  ],
  templateUrl: './building-create.page.html',
  styleUrl: './building-create.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildingCreatePage
  implements OnInit {

  private readonly api =
    inject(
      BuildingApiService
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

  readonly branchOptions =
    signal<BuildingBranchOption[]>(
      []
    );

  readonly branchOptionsLoading =
    signal(
      true
    );

  readonly branchOptionsError =
    signal(
      ''
    );

  ngOnInit(): void {

    this.loadBranchOptions();
  }

  loadBranchOptions(): void {

    this.branchOptionsLoading.set(
      true
    );

    this.branchOptionsError.set(
      ''
    );

    this.api
      .getBranchOptions()
      .subscribe({
        next:
          branches => {

            this.branchOptions.set(
              branches
            );

            this.branchOptionsLoading.set(
              false
            );
          },
        error:
          error => {

            this.branchOptions.set(
              []
            );

            this.branchOptionsError.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'buildings.loadBranchesFailed'
                )
              )
            );

            this.branchOptionsLoading.set(
              false
            );
          }
      });
  }

  save(
    value: BuildingFormValue
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
          value.description,
        branchId:
          value.branchId
      })
      .subscribe({
        next:
          building => {

            this.toast.success(
              this.translation.translate(
                'buildings.createSuccess'
              )
            );

            void this.router.navigate([
              '/app/property/buildings',
              building.id
            ]);
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'buildings.createFailed'
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
      '/app/property/buildings'
    ]);
  }

}
