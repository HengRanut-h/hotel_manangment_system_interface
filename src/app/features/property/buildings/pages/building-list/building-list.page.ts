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
  LucideBuilding2,
  LucideCircleCheck,
  LucideCircleX,
  LucideChevronLeft,
  LucideChevronRight,
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
  BuildingApiService
} from '../../data-access/building-api.service';

import {
  Building,
  BuildingQuery
} from '../../models/building.model';

type BuildingStatusFilter =
  | 'all'
  | 'active'
  | 'inactive';

type BuildingSortField =
  | 'name'
  | 'code'
  | 'createdAt';

type SortDirection =
  | 'asc'
  | 'desc';

@Component({
  selector: 'app-building-list-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    TranslationPipe,
    SpinComponent,
    LucideBuilding2,
    LucideCircleCheck,
    LucideCircleX,
    LucideChevronLeft,
    LucideChevronRight,
    LucideEye,
    LucideFilter,
    LucidePencil,
    LucidePlus,
    LucidePower,
    LucideRotateCcw,
    LucideSearch,
    LucideTrash2
  ],
  templateUrl: './building-list.page.html',
  styleUrl: './building-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildingListPage
  implements OnInit {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      BuildingApiService
    );

  private readonly toast =
    inject(
      ToastService
    );

  private readonly translation =
    inject(
      TranslationService
    );

  readonly buildings =
    signal<Building[]>(
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
    signal<BuildingStatusFilter>(
      'all'
    );

  readonly sortBy =
    signal<BuildingSortField>(
      'name'
    );

  readonly sortDirection =
    signal<SortDirection>(
      'asc'
    );

  readonly displayedBuildings =
    computed(
      () =>
        this.buildings()
    );

  readonly activeOnPage =
    computed(
      () =>
        this.buildings()
          .filter(
            building =>
              building.isActive
          )
          .length
    );

  readonly inactiveOnPage =
    computed(
      () =>
        this.buildings()
          .filter(
            building =>
              !building.isActive
          )
          .length
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
      BuildingQuery = {
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

            this.buildings.set(
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

            this.buildings.set(
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
                  'buildings.loadFailed'
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
    building: Building,
    active: boolean
  ): void {

    if (
      this.mutatingId()
    ) {
      return;
    }

    this.mutatingId.set(
      building.id
    );

    this.api
      .setActive(
        building.id,
        active
      )
      .subscribe({
        next:
          updated => {

            this.buildings.update(
              buildings =>
                buildings.map(
                  item =>
                    item.id === updated.id
                      ? updated
                      : item
                )
            );

            this.toast.success(
              this.translation.translate(
                active
                  ? 'buildings.activateSuccess'
                  : 'buildings.deactivateSuccess'
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
                    ? 'buildings.activateFailed'
                    : 'buildings.deactivateFailed'
                )
              )
            );

            this.mutatingId.set(
              null
            );
          }
      });
  }

  deleteBuilding(
    building: Building
  ): void {

    if (
      this.mutatingId()
    ) {
      return;
    }

    const message =
      this.translation.translate(
        'buildings.deleteConfirm',
        {
          name:
            building.name
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
      building.id
    );

    this.api
      .delete(
        building.id
      )
      .subscribe({
        next:
          () => {

            this.toast.success(
              this.translation.translate(
                'buildings.deleteSuccess'
              )
            );

            this.mutatingId.set(
              null
            );

            if (
              this.buildings().length === 1
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
                  'buildings.deleteFailed'
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
