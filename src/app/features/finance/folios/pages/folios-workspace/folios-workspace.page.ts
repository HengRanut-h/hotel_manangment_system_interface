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
  LucideCirclePlus,
  LucideClipboardList,
  LucideSearch
} from '@lucide/angular';

import {
  AuthStore
} from '../../../../../core/auth/auth.store';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

@Component({
  selector:
    'app-folios-workspace-page',

  standalone:
    true,

  imports: [
    RouterLink,
    TranslationPipe,
    LucideCirclePlus,
    LucideClipboardList,
    LucideSearch
  ],

  templateUrl:
    './folios-workspace.page.html',

  styleUrl:
    './folios-workspace.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class FoliosWorkspacePage {

  readonly auth =
    inject(AuthStore);

  private readonly router =
    inject(Router);

  readonly folioId =
    signal('');


  setFolioId(
    event: Event
  ): void {

    const target =
      event.target;

    if (
      target instanceof HTMLInputElement
    ) {
      this.folioId.set(
        target.value
      );
    }
  }


  openFolio(): void {

    const id =
      this.folioId()
        .trim();

    if (!id) {
      return;
    }

    void this.router.navigate([
      '/app/front-office/folios',
      id
    ]);
  }


  onKeydown(
    event: KeyboardEvent
  ): void {

    if (
      event.key === 'Enter'
    ) {
      event.preventDefault();
      this.openFolio();
    }
  }
}
