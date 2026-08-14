import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  LucideBadgeDollarSign,
  LucideBedDouble,
  LucideBuilding2,
  LucideDoorOpen,
  LucideGitBranch,
  LucideHotel,
  LucideLayers3,
  LucideSparkles
} from '@lucide/angular';

import {
  AuthStore
} from '../../../../core/authentication/auth.store';

import {
  PropertyFeature
} from '../../models/property-feature.model';

@Component({
  selector: 'app-property-home-page',
  standalone: true,

  imports: [
    RouterLink,

    LucideHotel,
    LucideGitBranch,
    LucideBuilding2,
    LucideLayers3,
    LucideBedDouble,
    LucideDoorOpen,
    LucideSparkles,
    LucideBadgeDollarSign
  ],

  templateUrl:
    './property-home.page.html',

  styleUrl:
    './property-home.page.css',

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class PropertyHomePage {

  readonly auth =
    inject(AuthStore);

  private readonly features:
    PropertyFeature[] = [
      {
        key: 'hotels',
        title: 'Hotels',
        description:
          'Manage hotel organizations, status and property-level information.',
        route:
          '/app/property/hotels',
        permission:
          'hotels.view',
        icon:
          'hotel'
      },
      {
        key: 'branches',
        title: 'Branches',
        description:
          'Manage hotel branches and physical operating locations.',
        route:
          '/app/property/branches',
        permission:
          'branches.view',
        icon:
          'git-branch'
      },
      {
        key: 'buildings',
        title: 'Buildings',
        description:
          'Manage buildings that belong to each hotel or branch.',
        route:
          '/app/property/buildings',
        permission:
          'buildings.view',
        icon:
          'building'
      },
      {
        key: 'floors',
        title: 'Floors',
        description:
          'Organize floors within buildings for room placement and operations.',
        route:
          '/app/property/floors',
        permission:
          'floors.view',
        icon:
          'layers'
      },
      {
        key: 'room-types',
        title: 'Room Types',
        description:
          'Configure room categories, capacity, base rate and characteristics.',
        route:
          '/app/property/room-types',
        permission:
          'room-types.view',
        icon:
          'bed-double'
      },
      {
        key: 'rooms',
        title: 'Rooms',
        description:
          'Manage room inventory, room numbers, types and operational status.',
        route:
          '/app/property/rooms',
        permission:
          'rooms.view',
        icon:
          'door-open'
      },
      {
        key: 'amenities',
        title: 'Amenities',
        description:
          'Manage room and property amenities used across the hotel.',
        route:
          '/app/property/amenities',
        permission:
          'amenities.view',
        icon:
          'sparkles'
      },
      {
        key: 'rates',
        title: 'Rates',
        description:
          'Manage rate plans and pricing configuration for rooms.',
        route:
          '/app/property/rates',
        permission:
          'rates.view',
        icon:
          'badge-dollar-sign'
      }
    ];

  readonly visibleFeatures =
    computed(() =>
      this.features.filter(
        feature =>
          this.auth.hasPermission(
            feature.permission
          )
      )
    );

  readonly visibleCount =
    computed(
      () =>
        this.visibleFeatures()
          .length
    );
}
