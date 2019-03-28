import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as missionStore from '@store/mission';

import * as models from '@models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Output() newSearchType = new EventEmitter<models.SearchType>();

  public searchTypes = models.SearchType;
  public searchType$ = this.store$.select(uiStore.getSearchType);
  public selectedSearchType: models.SearchType;

  public missionsByPlatform$ = this.store$.select(missionStore.getMissionsByPlatform);
  public missionPlatforms$ = this.missionsByPlatform$.pipe(
    map(missions => Object.keys(missions))
  );

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.searchType$.subscribe(
      searchType => this.selectedSearchType = searchType
    );
  }

  public onSetSearchType(searchType: models.SearchType): void {
    this.newSearchType.emit(searchType);
  }

  public onNewMissionSelected(selectedMission: string): void {
    console.log('Mission', selectedMission);
  }
}
