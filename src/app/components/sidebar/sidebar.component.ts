import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as filtersStore from '@store/filters';
import * as missionStore from '@store/mission';

import { HistoryService, Search, ListSearch, GeoSearch, MapService, WktService } from '@services';

import * as models from '@models';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  public searchType$ = this.store$.select(uiStore.getSearchType);
  public history$ = this.historyService.searchHistory$;

  public searchType = models.SearchType;

  constructor(
    private store$: Store<AppState>,
    private historyService: HistoryService,
    private mapService: MapService,
    private wkt: WktService,
  ) { }

  public onSetSearchType(searchType: models.SearchType): void {
    this.store$.dispatch(new uiStore.SetSearchType(searchType));
  }

  public onSetSearch(search: Search): void {
    if (search.type === models.SearchType.LIST) {
      this.setSearchList(<ListSearch>search.params);
    } else if (search.type === models.SearchType.DATASET) {
      this.setGeoSearch(<GeoSearch>search.params);
    }
  }

  private setSearchList(search: ListSearch): void {
    this.store$.dispatch(new uiStore.SetSearchType(models.SearchType.LIST));
    this.store$.dispatch(new filtersStore.SetListSearchType(search.type));
    this.store$.dispatch(new filtersStore.SetSearchList(search.list));
  }

  private setGeoSearch(search: GeoSearch): void {
    this.store$.dispatch(new filtersStore.SetState(search.filterState));
    this.store$.dispatch(new missionStore.SelectMission(search.mission));
    this.store$.dispatch(new uiStore.SetSearchType(models.SearchType.DATASET));

    if (search.polygon) {
      const features = this.wkt.wktToFeature(
        search.polygon,
        this.mapService.epsg()
      );

      this.mapService.setDrawFeature(features);
    }
  }
}
