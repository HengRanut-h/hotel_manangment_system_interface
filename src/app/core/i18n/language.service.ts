import {
  computed,
  Injectable,
  signal
} from '@angular/core';

import {
  APP_LANGUAGES,
  AppLanguage,
  AppLanguageCode,
  DEFAULT_LANGUAGE
} from './language.model';

const LANGUAGE_STORAGE_KEY =
  'hotel.language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  // =========================================================
  // AVAILABLE LANGUAGES
  // =========================================================

  readonly languages:
    readonly AppLanguage[] =
    APP_LANGUAGES;

  // =========================================================
  // CURRENT LANGUAGE
  // =========================================================

  private readonly language =
    signal<AppLanguageCode>(
      this.readStoredLanguage()
    );

  readonly currentLanguage =
    this.language.asReadonly();

  // =========================================================
  // CURRENT LANGUAGE INFORMATION
  // =========================================================

  readonly current =
    computed<AppLanguage>(
      () => {

        return (
          this.languages.find(
            language =>
              language.code ===
              this.language()
          )
          ??
          this.languages[0]
        );
      }
    );

  // =========================================================
  // CHANGE LANGUAGE
  // =========================================================

  setLanguage(
    languageCode: AppLanguageCode
  ): void {

    if (
      !this.isSupported(
        languageCode
      )
    ) {
      return;
    }

    this.language.set(
      languageCode
    );

    localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      languageCode
    );

    this.updateDocumentLanguage(
      languageCode
    );
  }

  // =========================================================
  // TOGGLE ENGLISH / KHMER
  // =========================================================

  toggleLanguage(): void {

    const nextLanguage:
      AppLanguageCode =
      this.language() === 'en'
        ? 'km'
        : 'en';

    this.setLanguage(
      nextLanguage
    );
  }

  // =========================================================
  // CHECK CURRENT LANGUAGE
  // =========================================================

  isCurrent(
    languageCode: AppLanguageCode
  ): boolean {

    return (
      this.language() ===
      languageCode
    );
  }

  // =========================================================
  // CHECK SUPPORTED LANGUAGE
  // =========================================================

  isSupported(
    languageCode: string
  ): languageCode is AppLanguageCode {

    return this.languages.some(
      language =>
        language.code ===
        languageCode
    );
  }

  // =========================================================
  // READ STORED LANGUAGE
  // =========================================================

  private readStoredLanguage():
    AppLanguageCode {

    const storedLanguage =
      localStorage.getItem(
        LANGUAGE_STORAGE_KEY
      );

    if (
      storedLanguage &&
      this.isSupported(
        storedLanguage
      )
    ) {

      this.updateDocumentLanguage(
        storedLanguage
      );

      return storedLanguage;
    }

    this.updateDocumentLanguage(
      DEFAULT_LANGUAGE
    );

    return DEFAULT_LANGUAGE;
  }

  // =========================================================
  // UPDATE HTML LANG ATTRIBUTE
  // =========================================================

  private updateDocumentLanguage(
    languageCode: AppLanguageCode
  ): void {

    if (
      typeof document ===
      'undefined'
    ) {
      return;
    }

    document.documentElement.lang =
      languageCode;
  }
}
