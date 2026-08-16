import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

import {
  LucideActivity,
  LucideArrowLeftRight,
  LucideBanknote,
  LucideBedDouble,
  LucideBell,
  LucideBoxes,
  LucideBuilding2,
  LucideCalendarCheck2,
  LucideChartNoAxesCombined,
  LucideCheckCheck,
  LucideCircleDollarSign,
  LucideClipboardList,
  LucideDoorOpen,
  LucideFileClock,
  LucideFilePlus2,
  LucideFlag,
  LucideGauge,
  LucideKeyRound,
  LucideLogIn,
  LucideLogOut,
  LucidePercent,
  LucideReceiptText,
  LucideRefreshCw,
  LucideSearch,
  LucideSettings2,
  LucideShield,
  LucideShoppingBag,
  LucideSparkles,
  LucideUserCheck,
  LucideUserRoundCog,
  LucideUsers,
  LucideUtensilsCrossed,
  LucideWalletCards,
  LucideZap
} from '@lucide/angular';

import {
  NavIcon
} from '../../../core/navigation/navigation.config';

@Component({
  selector:
    'app-navigation-icon',

  standalone:
    true,

  imports: [
    LucideActivity,
    LucideArrowLeftRight,
    LucideBanknote,
    LucideBedDouble,
    LucideBell,
    LucideBoxes,
    LucideBuilding2,
    LucideCalendarCheck2,
    LucideChartNoAxesCombined,
    LucideCheckCheck,
    LucideCircleDollarSign,
    LucideClipboardList,
    LucideDoorOpen,
    LucideFileClock,
    LucideFilePlus2,
    LucideFlag,
    LucideGauge,
    LucideKeyRound,
    LucideLogIn,
    LucideLogOut,
    LucidePercent,
    LucideReceiptText,
    LucideRefreshCw,
    LucideSearch,
    LucideSettings2,
    LucideShield,
    LucideShoppingBag,
    LucideSparkles,
    LucideUserCheck,
    LucideUserRoundCog,
    LucideUsers,
    LucideUtensilsCrossed,
    LucideWalletCards,
    LucideZap
  ],

  template: `
    @switch (icon()) {
      @case ('dashboard') { <svg lucideChartNoAxesCombined></svg> }
      @case ('calendar') { <svg lucideCalendarCheck2></svg> }
      @case ('users') { <svg lucideUsers></svg> }
      @case ('room') { <svg lucideDoorOpen></svg> }
      @case ('hotel') { <svg lucideBuilding2></svg> }
      @case ('money') { <svg lucideCircleDollarSign></svg> }
      @case ('document') { <svg lucideFilePlus2></svg> }
      @case ('gauge') { <svg lucideGauge></svg> }
      @case ('sparkles') { <svg lucideSparkles></svg> }
      @case ('settings') { <svg lucideSettings2></svg> }
      @case ('bell') { <svg lucideBell></svg> }
      @case ('flag') { <svg lucideFlag></svg> }
      @case ('search') { <svg lucideSearch></svg> }
      @case ('restaurant') { <svg lucideUtensilsCrossed></svg> }
      @case ('boxes') { <svg lucideBoxes></svg> }
      @case ('shopping') { <svg lucideShoppingBag></svg> }
      @case ('user-cog') { <svg lucideUserRoundCog></svg> }
      @case ('shield') { <svg lucideShield></svg> }
      @case ('chart') { <svg lucideChartNoAxesCombined></svg> }
      @case ('refresh') { <svg lucideRefreshCw></svg> }
      @case ('clock') { <svg lucideFileClock></svg> }
      @case ('check') { <svg lucideCheckCheck></svg> }
      @case ('clipboard') { <svg lucideClipboardList></svg> }
      @case ('log-in') { <svg lucideLogIn></svg> }
      @case ('log-out') { <svg lucideLogOut></svg> }
      @case ('user-check') { <svg lucideUserCheck></svg> }
      @case ('arrow-left-right') { <svg lucideArrowLeftRight></svg> }
      @case ('receipt') { <svg lucideReceiptText></svg> }
      @case ('wallet') { <svg lucideWalletCards></svg> }
      @case ('banknote') { <svg lucideBanknote></svg> }
      @case ('percent') { <svg lucidePercent></svg> }
      @case ('zap') { <svg lucideZap></svg> }
      @case ('activity') { <svg lucideActivity></svg> }
      @case ('key') { <svg lucideKeyRound></svg> }
      @default { <svg lucideBedDouble></svg> }
    }
  `,

  styles: [
    `
      :host {
        display: grid;
        place-items: center;
        width: 20px;
        height: 20px;
        border-radius: 7px;
        color: var(--nav-icon-color, #8fb3ff);
        background: color-mix(in srgb, var(--nav-icon-color, #8fb3ff) 16%, transparent);
      }

      :host svg {
        width: 14px;
        height: 14px;
        stroke-width: 1.9;
      }
    `
  ],

  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class NavigationIconComponent {
  readonly icon =
    input.required<NavIcon>();
}
