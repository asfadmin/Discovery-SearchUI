import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';

import { SubSink } from 'subsink';

import * as models from '@models';
import {
  MatListItem,
  MatListItemTitle,
  MatListItemMeta,
} from '@angular/material/list';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenuTrigger } from '@angular/material/menu';
import { OnDemandAddMenuComponent } from '@components/shared/on-demand-add-menu/on-demand-add-menu.component';
import { ShortDatePipe } from '@pipes/short-date.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pair',
  templateUrl: './pair.component.html',
  styleUrls: ['./pair.component.scss'],
  imports: [
    MatListItem,
    MatListItemTitle,
    MatListItemMeta,
    NgIf,
    MatIcon,
    MatTooltip,
    MatMenuTrigger,
    OnDemandAddMenuComponent,
    ShortDatePipe,
    TranslateModule,
  ],
})
export class PairComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);

  @Input() pair;
  @Input() hyp3able;

  @Output() togglePair = new EventEmitter();
  public hovered = false;

  public selectedPair: string[];
  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.store$
        .select(scenesStore.getSelectedPairIds)
        .subscribe((pair) => (this.selectedPair = pair)),
    );
  }

  public onPairSelected(pair): void {
    // const action = new scenesStore.SetSelectedPair(pair.map(p => p.id));
    this.togglePair.emit(pair.map((p) => p.id));
    // this.store$.dispatch(action);
  }

  public onSetHovered(): void {
    this.hovered = true;
  }

  public onClearHovered(): void {
    this.hovered = false;
  }

  public pairPerpBaseline(pair: models.CMRProductPair) {
    return Math.abs(
      pair[0].metadata.perpendicular - pair[1].metadata.perpendicular,
    );
  }

  public pairTempBaseline(pair: models.CMRProductPair) {
    return Math.abs(pair[0].metadata.temporal - pair[1].metadata.temporal);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
