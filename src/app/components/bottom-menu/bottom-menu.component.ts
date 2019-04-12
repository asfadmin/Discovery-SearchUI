import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as granulesStore from '@store/granules';
import * as queueStore from '@store/queue';

import * as models from '@models';

import {
  trigger, state, style,
  animate, transition
} from '@angular/animations';

@Component({
  selector: 'app-bottom-menu',
  templateUrl: './bottom-menu.component.html',
  styleUrls: ['./bottom-menu.component.css'],
  animations: [
    trigger('changeMenuY', [
      state('shown', style({ transform: 'translateY(0%)'
      })),
      state('hidden',   style({
        transform: 'translateY(100%)'
      })),
      transition('shown <=> hidden', animate('200ms ease-out'))
    ]),

    trigger('changeMenuX', [
      state('full-width', style({
        width: 'calc(100vw - 450px)'
      })),
      state('half-width',   style({
        width: '100vw'
      })),
      transition('shown <=> hidden', animate('200ms ease-out'))
    ])
  ],
})
export class BottomMenuComponent implements OnInit {
  public isBottomMenuOpen$ = this.store$.select(uiStore.getIsBottomMenuOpen);
  public isSideMenuOpen$ = this.store$.select(uiStore.getIsSidebarOpen);

  public selectedGranule$ = this.store$.select(granulesStore.getSelectedGranule);
  public selectedProducts$ = this.store$.select(granulesStore.getSelectedGranuleProducts);

  public granules$ = this.store$.select(granulesStore.getGranules);

  public isHidden = false;

  constructor(private store$: Store<AppState>) { }

  ngOnInit() {
    this.store$.select(uiStore.getIsHidden).subscribe(
      isHidden => this.isHidden = isHidden
    );
  }

  public onToggleMenu(): void {
    this.store$.dispatch(new uiStore.ToggleBottomMenu());
  }

  public onNewFocusedGranule(granule: models.Sentinel1Product): void {
    this.store$.dispatch(new granulesStore.SetFocusedGranule(granule));
  }

  public onClearFocusedGranule(): void {
    this.store$.dispatch(new granulesStore.ClearFocusedGranule());
  }

  public onNewGranuleSelected(name: string): void {
    this.store$.dispatch(new granulesStore.SetSelectedGranule(name));
  }

  public onQueueGranuleProducts(name: string): void {
    this.store$.dispatch(new queueStore.QueueGranule(name));
  }
}
