import { Component, OnInit } from '@angular/core';

import { Store, ActionsSubject } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';


import * as models from '@models';

@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.scss']
})
export class InfoBarComponent implements OnInit {
  public pathRange: models.Range<number | null>;
  public frameRange: models.Range<number | null>;
  public season: models.Range<number | null>;
  public shouldOmitSearchPolygon: boolean;
  public listSearchMode: models.ListSearchType;
  public searchList: string[];
  public productTypes: string;
  public beamModes: models.DatasetBeamModes;
  public polarizations: models.DatasetPolarizations;
  public flightDirections: models.FlightDirection[];
  public subtypes: string;


  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store$.select(filtersStore.getPathRange).subscribe(
      pathRange => this.pathRange = pathRange
    );
    this.store$.select(filtersStore.getFrameRange).subscribe(
      frameRange => this.frameRange = frameRange
    );
    this.store$.select(filtersStore.getSeason).subscribe(
      season => this.season = season
    );
    this.store$.select(filtersStore.getShouldOmitSearchPolygon).subscribe(
      shouldOmit  => this.shouldOmitSearchPolygon = shouldOmit
    );
    this.store$.select(filtersStore.getListSearchMode).subscribe(
      listSearchMode  => this.listSearchMode = listSearchMode
    );
    this.store$.select(filtersStore.getSearchList).subscribe(
      searchList  => this.searchList = searchList
    );
    this.store$.select(filtersStore.getProductTypes).subscribe(
      productTypes => this.productTypes = productTypes
        .map(subtype => subtype.apiValue)
        .join(',')
    );
    this.store$.select(filtersStore.getPolarizations).subscribe(
      pols  => this.polarizations = pols
    );
    this.store$.select(filtersStore.getBeamModes).subscribe(
      beamModes => this.beamModes = beamModes
    );
    this.store$.select(filtersStore.getFlightDirections).subscribe(
      flightDirs  => this.flightDirections = flightDirs
    );
    this.store$.select(filtersStore.getSubtypes).subscribe(
      subtypes => this.subtypes = subtypes
        .map(subtype => subtype.apiValue)
        .join(',')
    );
  }

}
