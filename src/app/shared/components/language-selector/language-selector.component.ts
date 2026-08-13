import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import {
  AppLanguageCode
} from '../../../core/i18n/language.model';

import {
  LanguageService
} from '../../../core/i18n/language.service';

@Component({
  selector:
    'app-language-selector',

  standalone:
    true,

  templateUrl:
    './language-selector.component.html',

  styleUrl:
    './language-selector.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class LanguageSelectorComponent {

  readonly languageService =
    inject(
      LanguageService
    );

  // =========================================================
  // CHANGE LANGUAGE
  // =========================================================

  changeLanguage(
    event: Event
  ): void {

    const select =
      event.target as
        HTMLSelectElement;

    const languageCode =
      select.value as
        AppLanguageCode;

    this.languageService
      .setLanguage(
        languageCode
      );
  }
}
