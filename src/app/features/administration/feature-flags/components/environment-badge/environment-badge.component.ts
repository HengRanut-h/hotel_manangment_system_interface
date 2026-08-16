import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  LucideCode2,
  LucideFlaskConical,
  LucideCloud,
  LucideServer,
  LucideLayers3
} from '@lucide/angular';

@Component({
  selector:
    'app-feature-flag-environment-badge',

  standalone:
    true,

  imports: [
    LucideCode2,
    LucideFlaskConical,
    LucideCloud,
    LucideServer,
    LucideLayers3
  ],

  templateUrl:
    './environment-badge.component.html',

  styleUrl:
    './environment-badge.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class EnvironmentBadgeComponent {

  readonly environment =
    input<string | null | undefined>();
}
