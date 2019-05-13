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
