import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as queueStore from '@store/queue';
import { Sentinel1Product } from '@models';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  @Output() openQueue = new EventEmitter<void>();

  @Input() products: Sentinel1Product[];

  public onOpenDownloadQueue(): void {
    this.openQueue.emit();
  }
}
