import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft
} from '@lucide/angular';

@Component({
  selector: 'app-page-header',

  standalone: true,

  imports: [
    RouterLink,
    LucideArrowLeft
  ],

  templateUrl:
    './page-header.component.html',

  styleUrl:
    './page-header.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class PageHeaderComponent {

  // =========================================================
  // CONTENT
  // =========================================================

  readonly eyebrow =
    input('');

  readonly title =
    input.required<string>();

  readonly description =
    input('');

  // =========================================================
  // BACK
  // =========================================================

  readonly showBack =
    input(true);

  readonly backLabel =
    input('Back');

  readonly backUrl =
    input<string | null>(
      null
    );
}
