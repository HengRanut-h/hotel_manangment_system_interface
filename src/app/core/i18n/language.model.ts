export type AppLanguageCode =
  'en' |
  'km';

export interface AppLanguage {
  code: AppLanguageCode;

  name: string;

  nativeName: string;

  flag: string;
}

// =========================================================
// LANGUAGES
// =========================================================

export const APP_LANGUAGES:
  readonly AppLanguage[] =
[
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },

  {
    code: 'km',
    name: 'Khmer',
    nativeName: 'ខ្មែរ',
    flag: '🇰🇭'
  }
];

// =========================================================
// DEFAULT LANGUAGE
// =========================================================

export const DEFAULT_LANGUAGE:
  AppLanguageCode =
  'en';
