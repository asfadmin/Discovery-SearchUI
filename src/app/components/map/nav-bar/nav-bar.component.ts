import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as queueStore from '@store/queue';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Output() openQueue = new EventEmitter<void>();

  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts).pipe(
    map(q => q || [])
  );

  constructor(private store$: Store<AppState>) { }

  ngOnInit() {
  }

  public onOpenDownloadQueue(): void {
    this.openQueue.emit();
  }
}
