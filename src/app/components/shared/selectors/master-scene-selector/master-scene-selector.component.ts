import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SubSink } from 'subsink';

import { SearchType, beta } from '@models';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as scenesStore from '@store/scenes';
// import * as models from '@models';
import { getSearchType } from '@store/search';

@Component({
  selector: 'app-master-scene-selector',
  templateUrl: './master-scene-selector.component.html',
  styleUrls: ['./master-scene-selector.component.css'],
  imports: [FormsModule, MatFormField, MatLabel, MatInput, TranslateModule],
})
export class MasterSceneSelectorComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);

  public searchType$ = this.store$.select(getSearchType);
  public datasets = [beta];
  public selectedDataset = 'SENTINEL-1 INTERFEROGRAM (BETA)';
  public SearchTypes = SearchType;
  public masterScene: string;
  public shouldUseFramesForReference = this.store$.selectSignal(
    filtersStore.getShouldUseFramesForReference,
  );
  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.store$
        .select(scenesStore.getFilterMaster)
        .subscribe((master) => (this.masterScene = master)),
    );
  }

  public onMasterSceneChanged(event: Event): void {
    this.store$.dispatch(
      new scenesStore.SetFilterMaster((event.target as HTMLInputElement).value),
    );
  }

  public onFrameModeToggled() {
    this.store$.dispatch(
      new filtersStore.SetUseFrameForBaseline(
        this.shouldUseFramesForReference(),
      ),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
