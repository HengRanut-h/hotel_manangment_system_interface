import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  RouterOutlet
} from '@angular/router';

@Component({
  selector: 'app-auth-layout',

  standalone: true,

  imports: [
    RouterOutlet
  ],

  template: `
    <main class="auth-shell">
      <router-outlet />
    </main>
  `,

  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }

      .auth-shell {
        width: 100%;
        min-height: 100vh;

        background: #f4f6f9;
      }
    `
  ],

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class AuthLayoutComponent {
}
