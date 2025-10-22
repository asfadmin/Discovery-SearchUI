import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as filtersStore from '@store/filters';
// import * as models from '@models';
import { getSearchType } from '@store/search';
import { SearchType } from '@models';
import { beta } from '@models';
@Component({
    selector: 'app-master-scene-selector',
    templateUrl: './master-scene-selector.component.html',
    styleUrls: ['./master-scene-selector.component.css'],
    standalone: false
})
export class MasterSceneSelectorComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);

  public searchType$ = this.store$.select(getSearchType);
  public datasets = [beta];
  public selectedDataset = 'SENTINEL-1 INTERFEROGRAM (BETA)';
  public SearchTypes = SearchType;
  public masterScene: string;
  public shouldUseFramesForReference = false;
  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.store$
        .select(scenesStore.getFilterMaster)
        .subscribe((master) => (this.masterScene = master)),
    );

    this.subs.add(
      this.store$
        .select(filtersStore.getShouldUseFramesForReference)
        .subscribe(
          (shouldUseFrames) =>
            (this.shouldUseFramesForReference = shouldUseFrames),
        ),
    );
  }

  public onMasterSceneChanged(event: Event): void {
    this.store$.dispatch(
      new scenesStore.SetFilterMaster((event.target as HTMLInputElement).value),
    );
  }

  public onFrameModeToggled() {
    this.store$.dispatch(
      new filtersStore.SetUseFrameForBaseline(this.shouldUseFramesForReference),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
