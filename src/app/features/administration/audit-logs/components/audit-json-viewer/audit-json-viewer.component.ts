import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

@Component({
  selector:
    'app-audit-json-viewer',

  standalone:
    true,

  templateUrl:
    './audit-json-viewer.component.html',

  styleUrl:
    './audit-json-viewer.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class AuditJsonViewerComponent {

  readonly value =
    input<string | null | undefined>();

  readonly formatted =
    computed(() => {

      const raw =
        this.value();

      if (
        !raw
      ) {
        return '—';
      }

      try {
        return JSON.stringify(
          JSON.parse(
            raw
          ),
          null,
          2
        );
      } catch {
        return raw;
      }
    });
}
