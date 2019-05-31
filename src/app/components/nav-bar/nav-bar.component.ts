import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QueueComponent } from '@components/nav-bar/queue';

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

  @Input() products: models.CMRProduct[];
  @Input() isLoading: boolean;

  constructor(private dialog: MatDialog) {}

  public onOpenDownloadQueue(): void {
    this.dialog.open(QueueComponent, {
      width: '550px', height: '700px', minHeight: '50%'
    });
  }

  public onDoSearch(): void {
    this.doSearch.emit();
  }

  public onClearSearch(): void {
    this.clearSearch.emit();
  }
}
