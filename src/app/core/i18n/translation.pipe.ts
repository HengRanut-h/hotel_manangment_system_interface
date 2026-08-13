import {
  Pipe,
  PipeTransform
} from '@angular/core';

import {
  TranslationService
} from './translation.service';

@Pipe({
  name: 'translate',

  standalone: true,

  pure: false
})
export class TranslationPipe
  implements PipeTransform {

  constructor(
    private readonly translationService:
      TranslationService
  ) {
  }

  // =========================================================
  // TRANSLATE
  // =========================================================

  transform(
    key:
      string,

    parameters?: Record<
      string,
      string | number
    >
  ): string {

    return this.translationService
      .translate(
        key,
        parameters
      );
  }
}
