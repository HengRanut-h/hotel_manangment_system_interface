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
  LucideFilePlus2
} from '@lucide/angular';
import {
  CreateFolioRequest
} from '../../models/folio.model';
import {
  FoliosApiService
} from '../../data-access/folios-api.service';
import {
  FolioCreateFormComponent
} from '../../components/folio-create-form/folio-create-form.component';

@Component({
  selector: 'app-folios-create-page',
  standalone: true,
  imports: [
    RouterLink,
    FolioCreateFormComponent,
    LucideArrowLeft,
    LucideFilePlus2
  ],
  templateUrl:
    './folios-create.page.html',
  styleUrl:
    './folios-create.page.css',
  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class FoliosCreatePage {
  private readonly api =
    inject(FoliosApiService);

  private readonly router =
    inject(Router);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly submitting =
    signal(false);

  readonly error =
    signal(false);

  create(
    request: CreateFolioRequest
  ): void {
    this.submitting.set(true);
    this.error.set(false);

    this.api
      .create(request)
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        ),
        finalize(
          () =>
            this.submitting.set(false)
        )
      )
      .subscribe({
        next:
          folio =>
            this.router.navigate(
              [
                '/app/finance/folios',
                folio.id
              ]
            ),
        error:
          error => {
            console.error(
              'Create folio error',
              error
            );
            this.error.set(true);
          }
      });
  }

  cancel(): void {
    this.router.navigate(
      ['/app/finance/folios']
    );
  }
}
