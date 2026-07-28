import { Component, output, inject, input, computed } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as filtersStore from '@store/filters';

import * as models from '@models';
import {
  MatListItem,
  MatListItemTitle,
  MatListItemMeta,
} from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenuTrigger } from '@angular/material/menu';
import { OnDemandAddMenuComponent } from '@components/shared/on-demand-add-menu/on-demand-add-menu.component';
import { ShortDatePipe } from '@pipes/short-date.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-pair',
  templateUrl: './pair.component.html',
  styleUrls: ['./pair.component.scss'],
  imports: [
    MatListItem,
    MatListItemTitle,
    MatListItemMeta,

    MatIcon,
    MatTooltip,
    MatMenuTrigger,
    OnDemandAddMenuComponent,
    ShortDatePipe,
    TranslateModule,
  ],
})
export class PairComponent {
  private store$ = inject<Store<AppState>>(Store);

  readonly pair = input<models.CMRProductPair>();
  readonly hyp3able = input<models.Hyp3ableProducts>();

  readonly togglePair = output<string[]>();

  public hovered = false;

  readonly selectedPair = toSignal(
    this.store$.select(scenesStore.getSelectedPairIds),
  );

  readonly isFrameMode = toSignal(
    this.store$.select(filtersStore.getShouldUseFramesForReference),
  );

  readonly isSelected = computed(() => {
    const selected = this.selectedPair();

    if (!selected) {
      return false;
    } else {
      return (
        this.pair()[0].id + this.pair()[1].id === selected[0] + selected[1]
      );
    }
  });

  readonly pairPerpBaseline = computed(() =>
    Math.abs(
      this.pair()[0].metadata.perpendicular -
        this.pair()[1].metadata.perpendicular,
    ),
  );

  readonly pairTempBaseline = computed(() =>
    Math.abs(
      this.pair()[0].metadata.temporal - this.pair()[1].metadata.temporal,
    ),
  );

  public onPairSelected(pair: models.CMRProductPair): void {
    this.togglePair.emit(pair.map((p) => p.id));
  }

  public onSetHovered(): void {
    this.hovered = true;
  }

  public onClearHovered(): void {
    this.hovered = false;
  }
}
