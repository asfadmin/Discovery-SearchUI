import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {

  @Output() openQueue = new EventEmitter<void>();
  @Output() doSearch = new EventEmitter<void>();
  @Output() clearSearch = new EventEmitter<void>();

  @Input() products: models.Sentinel1Product[];

  public onOpenDownloadQueue(): void {
    this.openQueue.emit();
  }

  public onDoSearch(): void {
    this.doSearch.emit();
  }

  public onClearSearch(): void {
    this.clearSearch.emit();
  }
}
