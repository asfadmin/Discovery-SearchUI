import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as queueStore from '@store/queue';
import * as scenesStore from '@store/scenes';
import * as uiStore from '@store/ui';

import { ScreenSizeService } from '@services';
import { Breakpoints } from '@models';
import { SubSink } from 'subsink';
import * as searchStore from '@store/search';
import * as models from '@models';


@Component({
  selector: 'app-baseline-header',
  templateUrl: './baseline-header.component.html',
  styleUrls: ['./baseline-header.component.css',  '../header.component.scss']
})
export class BaselineHeaderComponent implements OnInit {
  @Output() public openQueue = new EventEmitter<void>();

  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts);
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;
  public areResultsLoaded: boolean;

  public selectedProducts$ = this.store$.select(scenesStore.getSelectedSceneProducts);

  public searchType$ = this.store$.select(searchStore.getSearchType);
  public searchTypes = models.SearchType;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(scenesStore.getAreResultsLoaded).subscribe(
        areLoaded => this.areResultsLoaded = areLoaded
      )
    );
  }

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.OpenFiltersMenu());
  }

  public onOpenDownloadQueue(): void {
    this.openQueue.emit();
  }
}
