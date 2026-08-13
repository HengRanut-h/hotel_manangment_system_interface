import {
  effect,
  inject,
  Injectable,
  signal
} from '@angular/core';

import {
  HttpBackend,
  HttpClient
} from '@angular/common/http';

import {
  catchError,
  forkJoin,
  of
} from 'rxjs';

import {
  AppLanguageCode
} from './language.model';

import {
  LanguageService
} from './language.service';

type TranslationValue =
  string |
  TranslationDictionary;

interface TranslationDictionary {
  [key: string]:
    TranslationValue;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  // =========================================================
  // SERVICES
  // =========================================================

  private readonly languageService =
    inject(
      LanguageService
    );

  private readonly http:
    HttpClient;

  // =========================================================
  // STATE
  // =========================================================

  private readonly translations =
    signal<TranslationDictionary>(
      {}
    );

  readonly loading =
    signal(false);

  readonly loaded =
    signal(false);

  // =========================================================
  // REQUEST VERSION
  // =========================================================

  private requestVersion =
    0;

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    backend:
      HttpBackend
  ) {

    // Translation files should bypass
    // authentication/error interceptors.

    this.http =
      new HttpClient(
        backend
      );

    effect(
      () => {

        const languageCode =
          this.languageService
            .currentLanguage();

        this.load(
          languageCode
        );
      }
    );
  }

  // =========================================================
  // TRANSLATE
  // =========================================================

  translate(
    key: string,

    parameters?: Record<
      string,
      string | number
    >
  ): string {

    if (
      !key ||
      !key.trim()
    ) {
      return '';
    }

    const value =
      this.resolve(
        this.translations(),
        key
      );

    let result =
      typeof value === 'string'
        ? value
        : this.humanizeKey(
            key
          );

    // =======================================================
    // PARAMETERS
    //
    // Example:
    // Delete role "{{name}}"?
    // =======================================================

    if (
      parameters
    ) {

      for (
        const [
          parameter,
          parameterValue
        ]
        of Object.entries(
          parameters
        )
      ) {

        result =
          result.replaceAll(
            `{{${parameter}}}`,
            String(
              parameterValue
            )
          );
      }
    }

    return result;
  }

  // =========================================================
  // LOAD TRANSLATIONS
  // =========================================================

  private load(
    languageCode:
      AppLanguageCode
  ): void {

    const requestVersion =
      ++this.requestVersion;

    this.loading.set(
      true
    );

    // =======================================================
    // ENGLISH IS THE BASE/FALLBACK LANGUAGE
    // =======================================================

    const englishRequest =
      this.http
        .get<TranslationDictionary>(
          '/i18n/en.json'
        )
        .pipe(
          catchError(
            error => {

              console.error(
                'Unable to load English translations.',
                error
              );

              return of(
                {}
              );
            }
          )
        );

    // =======================================================
    // ENGLISH SELECTED
    // =======================================================

    if (
      languageCode ===
      'en'
    ) {

      englishRequest
        .subscribe(
          dictionary => {

            if (
              requestVersion !==
              this.requestVersion
            ) {
              return;
            }

            this.translations.set(
              dictionary
            );

            this.loaded.set(
              true
            );

            this.loading.set(
              false
            );
          }
        );

      return;
    }

    // =======================================================
    // SELECTED LANGUAGE
    // =======================================================

    const selectedLanguageRequest =
      this.http
        .get<TranslationDictionary>(
          `/i18n/${languageCode}.json`
        )
        .pipe(
          catchError(
            error => {

              console.error(
                `Unable to load ${languageCode} translations.`,
                error
              );

              return of(
                {}
              );
            }
          )
        );

    // =======================================================
    // MERGE ENGLISH + SELECTED LANGUAGE
    //
    // English becomes automatic fallback.
    // =======================================================

    forkJoin({
      english:
        englishRequest,

      selected:
        selectedLanguageRequest
    })
      .subscribe(
        response => {

          if (
            requestVersion !==
            this.requestVersion
          ) {
            return;
          }

          const merged =
            this.deepMerge(
              response.english,
              response.selected
            );

          this.translations.set(
            merged
          );

          this.loaded.set(
            true
          );

          this.loading.set(
            false
          );
        }
      );
  }

  // =========================================================
  // RESOLVE KEY
  //
  // roles.edit
  // roles.editDescription
  // common.cancel
  // =========================================================

  private resolve(
    dictionary:
      TranslationDictionary,

    key:
      string
  ): TranslationValue | undefined {

    const parts =
      key.split('.');

    let current:
      TranslationValue =
      dictionary;

    for (
      const part
      of parts
    ) {

      if (
        !current ||
        typeof current !==
          'object'
      ) {
        return undefined;
      }

      const currentDictionary =
        current as
          TranslationDictionary;

      const next =
        currentDictionary[
          part
        ];

      if (
        next ===
        undefined
      ) {
        return undefined;
      }

      current =
        next;
    }

    return current;
  }

  // =========================================================
  // DEEP MERGE
  // =========================================================

  private deepMerge(
    base:
      TranslationDictionary,

    override:
      TranslationDictionary
  ): TranslationDictionary {

    const result:
      TranslationDictionary =
    {
      ...base
    };

    for (
      const [
        key,
        overrideValue
      ]
      of Object.entries(
        override
      )
    ) {

      const baseValue =
        result[
          key
        ];

      if (
        this.isDictionary(
          baseValue
        )
        &&
        this.isDictionary(
          overrideValue
        )
      ) {

        result[
          key
        ] =
          this.deepMerge(
            baseValue,
            overrideValue
          );

        continue;
      }

      result[
        key
      ] =
        overrideValue;
    }

    return result;
  }

  // =========================================================
  // DICTIONARY CHECK
  // =========================================================

  private isDictionary(
    value:
      unknown
  ): value is TranslationDictionary {

    return (
      value !==
        null
      &&
      typeof value ===
        'object'
      &&
      !Array.isArray(
        value
      )
    );
  }

  // =========================================================
  // HUMANIZE MISSING KEY
  //
  // roles.editDescription
  // ->
  // Edit description
  //
  // common.cancel
  // ->
  // Cancel
  //
  // roomAssignments.title
  // ->
  // Title
  // =========================================================

  private humanizeKey(
    key:
      string
  ): string {

    const finalPart =
      key
        .split('.')
        .filter(Boolean)
        .pop()
      ??
      key;

    const words =
      finalPart
        .replace(
          /([a-z0-9])([A-Z])/g,
          '$1 $2'
        )
        .replace(
          /[_-]+/g,
          ' '
        )
        .trim();

    if (
      !words
    ) {
      return '';
    }

    return (
      words
        .charAt(0)
        .toUpperCase()
      +
      words
        .slice(1)
        .toLowerCase()
    );
  }
}
