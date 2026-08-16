import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal
} from '@angular/core';

import {
  LucideEye,
  LucideEyeOff
} from '@lucide/angular';

@Component({
  selector:
    'app-setting-value-viewer',

  standalone:
    true,

  imports: [
    LucideEye,
    LucideEyeOff
  ],

  templateUrl:
    './setting-value-viewer.component.html',

  styleUrl:
    './setting-value-viewer.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class SettingValueViewerComponent {

  readonly value =
    input<string | null | undefined>();

  readonly sensitive =
    input<boolean | null | undefined>();

  readonly valueType =
    input<string | null | undefined>();

  readonly revealed =
    signal(false);

  readonly formatted =
    computed(() => {

      const value =
        this.value();

      if (
        value === null ||
        value === undefined ||
        value === ''
      ) {
        return '—';
      }

      if (
        this.sensitive() &&
        !this.revealed()
      ) {
        return '••••••••';
      }

      if (
        this.valueType() === 'Json'
      ) {
        try {
          return JSON.stringify(
            JSON.parse(
              value
            ),
            null,
            2
          );
        } catch {
          return value;
        }
      }

      return value;
    });
}
