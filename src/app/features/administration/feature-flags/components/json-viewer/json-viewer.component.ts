import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input
} from '@angular/core';

@Component({
  selector:
    'app-feature-flag-json-viewer',

  standalone:
    true,

  template:
    '<pre>{{ formatted() }}</pre>',

  styles:
  [`
    pre {
      max-height: 380px;
      margin: 0;
      overflow: auto;
      padding: 14px;
      border-radius: 12px;
      background: #101828;
      color: #f2f4f7;
      font-family: Consolas, "Courier New", monospace;
      font-size: 12px;
      line-height: 1.55;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
  `],

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class JsonViewerComponent {

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
