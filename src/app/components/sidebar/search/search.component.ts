import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { AppState } from '@store';
import * as missionStore from '@store/mission';

import * as models from '@models';

const icon: boolean = false;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Input() selectedSearchType: models.SearchType;
  @Output() newSearchType = new EventEmitter<models.SearchType>();

  public searchTypes = models.SearchType;

  public missionsByPlatform$ = this.store$.select(missionStore.getMissionsByPlatform);
  public selectedMission$ = this.store$.select(missionStore.getSelectedMission);
  public missionPlatforms$ = this.missionsByPlatform$.pipe(
    map(missions => Object.keys(missions))
  );

  constructor(private store$: Store<AppState>) {}

  ngOnInit() {
  }

  public onSetSearchType(searchType: models.SearchType): void {
    this.newSearchType.emit(searchType);
  }

  public onNewMissionSelected(selectedMission: string): void {
    this.store$.dispatch(new missionStore.SelectMission(selectedMission));
  }
}


