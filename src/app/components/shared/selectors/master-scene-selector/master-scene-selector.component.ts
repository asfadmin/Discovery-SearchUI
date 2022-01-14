import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import { getSearchType } from '@store/search';
import { SearchType } from '@models';

@Component({
  selector: 'app-master-scene-selector',
  templateUrl: './master-scene-selector.component.html',
  styleUrls: ['./master-scene-selector.component.css']
})
export class MasterSceneSelectorComponent implements OnInit, OnDestroy {
  public searchType$ = this.store$.select(getSearchType);
  public SearchTypes = SearchType;
  public masterScene: string;
  private subs = new SubSink();

  constructor(private store$: Store<AppState>) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(scenesStore.getFilterMaster).subscribe(
        master => this.masterScene = master
      )
    );
  }

  public onMasterSceneChanged(event: Event): void {
    this.store$.dispatch(new scenesStore.SetFilterMaster((event.target as HTMLInputElement).value));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
