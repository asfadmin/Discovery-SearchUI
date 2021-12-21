import { Component, OnInit } from '@angular/core';
import * as models from '@models';

import { Store } from '@ngrx/store';
import { AppState } from '@store';

import * as queueStore from '@store/queue';
import * as filterStore from '@store/filters';
import * as uiStore from '@store/ui';

import { SubSink } from 'subsink';
import * as services from '@services';

@Component({
  selector: 'app-sarviews-header',
  templateUrl: './sarviews-header.component.html',
  styleUrls: ['./sarviews-header.component.scss', '../header.component.scss']
})
export class SarviewsHeaderComponent implements OnInit {
  public datasets = models.datasetList;
  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts);
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  private subs = new SubSink();

  public selectedDataset: string;

  constructor(
    private store$: Store<AppState>,
    private screenSize: services.ScreenSizeService,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.store$.select(filterStore.getSelectedDatasetId).subscribe(
        selected => this.selectedDataset = selected
      )
    );
  }

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.OpenFiltersMenu());
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }

  public closeAOIOptions(): void {
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }

  public onDatasetChange(dataset: string): void {
    this.store$.dispatch(new filterStore.SetSelectedDataset(dataset));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
