import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as uiStore from '@store/ui';

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
}
