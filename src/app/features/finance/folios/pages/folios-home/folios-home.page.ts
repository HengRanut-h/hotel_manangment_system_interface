import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink
} from '@angular/router';
import {
  LucideBookOpen,
  LucideSearch,
  LucidePlus
} from '@lucide/angular';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

@Component({
  selector: 'app-folios-home-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    TranslationPipe,
    LucideBookOpen,
    LucideSearch,
    LucidePlus
  ],
  templateUrl:
    './folios-home.page.html',
  styleUrl:
    './folios-home.page.css',
  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class FoliosHomePage {
  private readonly router =
    inject(Router);

  readonly id =
    signal('');

  open(): void {
    const id =
      this.id().trim();

    if (!id) {
      return;
    }

    this.router.navigate(
      [
        '/app/finance/folios',
        id
      ]
    );
  }
}
