import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import {
  LucideBell,
  LucideCheck,
  LucideChevronDown,
  LucideChevronLeft,
  LucideChevronRight,
  LucideCommand,
  LucideLogOut,
  LucideMenu,
  LucideSearch,
  LucideX
} from '@lucide/angular';

import {
  AuthStore
} from '../../core/auth/auth.store';

import {
  AppLanguageCode
} from '../../core/i18n/language.model';

import {
  LanguageService
} from '../../core/i18n/language.service';

import {
  APP_NAVIGATION
} from '../../core/navigation/navigation.config';

import {
  NavigationIconComponent
} from '../../shared/ui/navigation-icon/navigation-icon.component';

@Component({
  selector: 'app-layout',

  standalone: true,

  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,

    NavigationIconComponent,

    LucideBell,
    LucideCheck,
    LucideChevronDown,
    LucideChevronLeft,
    LucideChevronRight,
    LucideCommand,
    LucideLogOut,
    LucideMenu,
    LucideSearch,
    LucideX
  ],

  templateUrl:
    './app-layout.component.html',

  styleUrl:
    './app-layout.component.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class AppLayoutComponent {

  // =========================================================
  // SERVICES
  // =========================================================

  readonly auth =
    inject(
      AuthStore
    );

  readonly language =
    inject(
      LanguageService
    );

  private readonly router =
    inject(
      Router
    );

  // =========================================================
  // LAYOUT STATE
  // =========================================================

  readonly collapsed =
    signal(false);

  readonly mobileOpen =
    signal(false);

  readonly navSearch =
    signal('');

  readonly languageMenuOpen =
    signal(false);

  // =========================================================
  // NAVIGATION
  // =========================================================

  readonly groups =
    computed(
      () =>
        APP_NAVIGATION
          .map(
            group => ({
              ...group,

              items:
                group.items.filter(
                  item =>
                    (
                      !item.permission ||
                      this.auth.hasPermission(
                        item.permission
                      )
                    )
                    &&
                    (
                      !this.navSearch()
                        .trim()
                      ||
                      `${
                        item.label
                      } ${
                        item.keywords ??
                        ''
                      }`
                        .toLowerCase()
                        .includes(
                          this.navSearch()
                            .trim()
                            .toLowerCase()
                        )
                    )
                )
            })
          )
          .filter(
            group =>
              group.items.length > 0
          )
    );

  // =========================================================
  // USER INITIALS
  // =========================================================

  readonly initials =
    computed(
      () =>
        this.auth
          .displayName()
          .split(/\s+/)
          .filter(Boolean)
          .map(
            name =>
              name[0]
          )
          .join('')
          .slice(
            0,
            2
          )
          .toUpperCase()
        ||
        'U'
    );

  // =========================================================
  // SEARCH
  // =========================================================

  setSearch(
    event: Event
  ): void {

    const input =
      event.target as
        HTMLInputElement;

    this.navSearch.set(
      input.value
    );
  }

  // =========================================================
  // SIDEBAR
  // =========================================================

  toggleCollapsed(): void {

    this.collapsed.update(
      value =>
        !value
    );
  }

  // =========================================================
  // MOBILE
  // =========================================================

  closeMobile(): void {

    this.mobileOpen.set(
      false
    );
  }

  // =========================================================
  // LANGUAGE MENU
  // =========================================================

  toggleLanguageMenu(): void {

    this.languageMenuOpen.update(
      value =>
        !value
    );
  }

  // =========================================================
  // CHANGE LANGUAGE
  // =========================================================

  changeLanguage(
    languageCode:
      AppLanguageCode
  ): void {

    this.language
      .setLanguage(
        languageCode
      );

    this.languageMenuOpen.set(
      false
    );
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {

    this.auth.logout();
  }

  // =========================================================
  // PROFILE
  // =========================================================

  goProfile(): void {

    void this.router.navigate([
      '/app/profile'
    ]);
  }
}
