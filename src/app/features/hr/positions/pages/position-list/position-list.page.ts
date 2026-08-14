import {
  DatePipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  LucideBriefcaseBusiness,
  LucideChevronLeft,
  LucideChevronRight,
  LucideCircleCheck,
  LucideCircleX,
  LucideEye,
  LucideFilter,
  LucidePencil,
  LucidePlus,
  LucidePower,
  LucideRotateCcw,
  LucideSearch,
  LucideTrash2
} from '@lucide/angular';

import {
  AuthStore
} from '../../../../../core/auth/auth.store';

import {
  getSafeApiErrorMessage
} from '../../../../../core/http/api-error.util';

import {
  TranslationPipe
} from '../../../../../core/i18n/translation.pipe';

import {
  TranslationService
} from '../../../../../core/i18n/translation.service';

import {
  SpinComponent
} from '../../../../../shared/ui/spin/spin.component';

import {
  ToastService
} from '../../../../../shared/ui/toast/toast.service';

import {
  PositionApiService
} from '../../data-access/position-api.service';

import {
  Position,
  PositionQuery
} from '../../models/position.model';

type PositionStatusFilter =
  | 'all'
  | 'active'
  | 'inactive';

type PositionSortField =
  | 'name'
  | 'code'
  | 'createdAt';

type SortDirection =
  | 'asc'
  | 'desc';

@Component({
  selector: 'app-position-list.page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    TranslationPipe,
    SpinComponent,
    LucideBriefcaseBusiness,
    LucideChevronLeft,
    LucideChevronRight,
    LucideCircleCheck,
    LucideCircleX,
    LucideEye,
    LucideFilter,
    LucidePencil,
    LucidePlus,
    LucidePower,
    LucideRotateCcw,
    LucideSearch,
    LucideTrash2
  ],
  templateUrl: './position-list.page.html',
  styleUrl: './position-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PositionListPage
  implements OnInit {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      PositionApiService
    );

  private readonly toast =
    inject(
      ToastService
    );

  private readonly translation =
    inject(
      TranslationService
    );

  readonly positions =
    signal<Position[]>(
      []
    );

  readonly loading =
    signal(
      true
    );

  readonly error =
    signal(
      ''
    );

  readonly mutatingId =
    signal<string | null>(
      null
    );

  readonly search =
    signal(
      ''
    );

  readonly status =
    signal<PositionStatusFilter>(
      'all'
    );

  readonly sortBy =
    signal<PositionSortField>(
      'name'
    );

  readonly sortDirection =
    signal<SortDirection>(
      'asc'
    );

  readonly pageNumber =
    signal(
      1
    );

  readonly pageSize =
    signal(
      20
    );

  readonly totalCount =
    signal(
      0
    );

  readonly totalPages =
    signal(
      1
    );

  readonly hasPreviousPage =
    signal(
      false
    );

  readonly hasNextPage =
    signal(
      false
    );

  readonly activeOnPage =
    computed(
      () =>
        this.positions()
          .filter(
            position =>
              position.isActive
          )
          .length
    );

  readonly inactiveOnPage =
    computed(
      () =>
        this.positions()
          .filter(
            position =>
              !position.isActive
          )
          .length
    );

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    this.loading.set(
      true
    );

    this.error.set(
      ''
    );

    const query:
      PositionQuery = {
      search:
        this.search()
          .trim(),
      isActive:
        this.status() === 'all'
          ? undefined
          : this.status() === 'active',
      sortBy:
        this.sortBy(),
      sortDirection:
        this.sortDirection(),
      pageNumber:
        this.pageNumber(),
      pageSize:
        this.pageSize()
    };

    this.api
      .getPage(
        query
      )
      .subscribe({
        next:
          result => {

            this.positions.set(
              result.items
            );

            this.pageNumber.set(
              result.pageNumber
            );

            this.pageSize.set(
              result.pageSize
            );

            this.totalCount.set(
              result.totalItems
            );

            this.totalPages.set(
              Math.max(
                1,
                result.totalPages
              )
            );

            this.hasPreviousPage.set(
              result.hasPreviousPage
            );

            this.hasNextPage.set(
              result.hasNextPage
            );

            this.loading.set(
              false
            );
          },
        error:
          error => {

            this.positions.set(
              []
            );

            this.totalCount.set(
              0
            );

            this.totalPages.set(
              1
            );

            this.hasPreviousPage.set(
              false
            );

            this.hasNextPage.set(
              false
            );

            this.error.set(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'positions.loadFailed'
                )
              )
            );

            this.loading.set(
              false
            );
          }
      });
  }

  applyFilters(): void {

    this.pageNumber.set(
      1
    );

    this.load();
  }

  clearFilters(): void {

    this.search.set(
      ''
    );

    this.status.set(
      'all'
    );

    this.sortBy.set(
      'name'
    );

    this.sortDirection.set(
      'asc'
    );

    this.pageNumber.set(
      1
    );

    this.load();
  }

  previousPage(): void {

    if (
      this.loading()
      ||
      !this.hasPreviousPage()
    ) {
      return;
    }

    this.pageNumber.update(
      value =>
        value - 1
    );

    this.load();
  }

  nextPage(): void {

    if (
      this.loading()
      ||
      !this.hasNextPage()
    ) {
      return;
    }

    this.pageNumber.update(
      value =>
        value + 1
    );

    this.load();
  }

  setActive(
    position: Position,
    active: boolean
  ): void {

    if (
      this.mutatingId()
    ) {
      return;
    }

    this.mutatingId.set(
      position.id
    );

    this.api
      .setActive(
        position.id,
        active
      )
      .subscribe({
        next:
          updated => {

            this.positions.update(
              positions =>
                positions.map(
                  item =>
                    item.id === updated.id
                      ? updated
                      : item
                )
            );

            this.toast.success(
              this.translation.translate(
                active
                  ? 'positions.activateSuccess'
                  : 'positions.deactivateSuccess'
              )
            );

            this.mutatingId.set(
              null
            );
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  active
                    ? 'positions.activateFailed'
                    : 'positions.deactivateFailed'
                )
              )
            );

            this.mutatingId.set(
              null
            );
          }
      });
  }

  deletePosition(
    position: Position
  ): void {

    if (
      this.mutatingId()
    ) {
      return;
    }

    const message =
      this.translation.translate(
        'positions.deleteConfirm',
        {
          name:
            position.name
        }
      );

    if (
      !window.confirm(
        message
      )
    ) {
      return;
    }

    this.mutatingId.set(
      position.id
    );

    this.api
      .delete(
        position.id
      )
      .subscribe({
        next:
          () => {

            this.toast.success(
              this.translation.translate(
                'positions.deleteSuccess'
              )
            );

            this.mutatingId.set(
              null
            );

            if (
              this.positions().length === 1
              &&
              this.pageNumber() > 1
            ) {
              this.pageNumber.update(
                value =>
                  value - 1
              );
            }

            this.load();
          },
        error:
          error => {

            this.toast.error(
              getSafeApiErrorMessage(
                error,
                this.translation.translate(
                  'positions.deleteFailed'
                )
              )
            );

            this.mutatingId.set(
              null
            );
          }
      });
  }

}
