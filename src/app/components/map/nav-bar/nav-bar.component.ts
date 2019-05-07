import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import {
  trigger, state, style,
  animate, transition
} from '@angular/animations';

import * as models from '@models';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  animations: [
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
export class NavBarComponent {

  @Output() openQueue = new EventEmitter<void>();
  @Output() doSearch = new EventEmitter<void>();

  @Input() products: models.Sentinel1Product[];
  @Input() isSideMenuOpen: boolean;

  public onOpenDownloadQueue(): void {
    this.openQueue.emit();
  }

  public onDoSearch(): void {
    this.doSearch.emit();
  }
}
