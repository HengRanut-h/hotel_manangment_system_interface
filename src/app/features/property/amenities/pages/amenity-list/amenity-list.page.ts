import {
  DatePipe
} from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
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
  AmenityApiService
} from '../../data-access/amenity-api.service';

import {
  Amenity,
  AmenityQuery
} from '../../models/amenity.model';

type AmenityStatusFilter =
  | 'all'
  | 'active'
  | 'inactive';

type AmenitySortField =
  | 'name'
  | 'code'
  | 'createdAt';

type SortDirection =
  | 'asc'
  | 'desc';

@Component({
  selector: 'app-amenity-list-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    TranslationPipe,
    SpinComponent,
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
  templateUrl: './amenity-list.page.html',
  styleUrl: './amenity-list.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmenityListPage
  implements OnInit {

  readonly auth =
    inject(
      AuthStore
    );

  private readonly api =
    inject(
      AmenityApiService
    );

  private readonly toast =
    inject(
      ToastService
    );

  private readonly translation =
    inject(
      TranslationService
    );

  readonly amenities =
    signal<Amenity[]>(
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
    signal<AmenityStatusFilter>(
      'all'
    );

  readonly sortBy =
    signal<AmenitySortField>(
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
      AmenityQuery = {
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

            this.amenities.set(
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

            this.amenities.set(
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
                  'amenities.loadFailed'
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
    amenity: Amenity,
    active: boolean
  ): void {

    if (
      this.mutatingId()
    ) {
      return;
    }

    this.mutatingId.set(
      amenity.id
    );

    this.api
      .setActive(
        amenity.id,
        active
      )
      .subscribe({
        next:
          updated => {

            this.amenities.update(
              amenities =>
                amenities.map(
                  item =>
                    item.id === updated.id
                      ? updated
                      : item
                )
            );

            this.toast.success(
              this.translation.translate(
                active
                  ? 'amenities.activateSuccess'
                  : 'amenities.deactivateSuccess'
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
                    ? 'amenities.activateFailed'
                    : 'amenities.deactivateFailed'
                )
              )
            );

            this.mutatingId.set(
              null
            );
          }
      });
  }

  deleteAmenity(
    amenity: Amenity
  ): void {

    if (
      this.mutatingId()
    ) {
      return;
    }

    const message =
      this.translation.translate(
        'amenities.deleteConfirm',
        {
          name:
            amenity.name
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
      amenity.id
    );

    this.api
      .delete(
        amenity.id
      )
      .subscribe({
        next:
          () => {

            this.toast.success(
              this.translation.translate(
                'amenities.deleteSuccess'
              )
            );

            this.mutatingId.set(
              null
            );

            if (
              this.amenities().length === 1
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
                  'amenities.deleteFailed'
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
