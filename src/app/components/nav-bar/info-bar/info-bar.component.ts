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
  public productTypes: models.ProductType[];
  public beamModes: models.DatasetBeamModes;
  public polarizations: models.DatasetPolarizations;
  public flightDirections: models.FlightDirection[];
  public subtypes: string;


  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store$.select(filtersStore.getPathRange).subscribe(
      range => this.pathRange = range
    );
    this.store$.select(filtersStore.getFrameRange).subscribe(
      range => this.frameRange = range
    );
    this.store$.select(filtersStore.getSeason).subscribe(
      range => this.season = range
    );
    this.store$.select(filtersStore.getShouldOmitSearchPolygon).subscribe(
      boolean  => this.shouldOmitSearchPolygon = boolean
    );
    this.store$.select(filtersStore.getListSearchMode).subscribe(
      boolean  => this.listSearchMode = boolean
    );
    this.store$.select(filtersStore.getSearchList).subscribe(
      string  => this.searchList = string
    );
    this.store$.select(filtersStore.getProductTypes).subscribe(
      any  => this.productTypes = any
    );
    this.store$.select(filtersStore.getPolarizations).subscribe(
      any  => this.polarizations = any
    );
    this.store$.select(filtersStore.getBeamModes).subscribe(
      any  => this.beamModes = any
    );
    this.store$.select(filtersStore.getFlightDirections).subscribe(
      any  => this.flightDirections = any
    );
    this.store$.select(filtersStore.getSubtypes).subscribe(
      subtypes => this.subtypes = subtypes
      .map(subtype => subtype.apiValue)
      .join(',')
    );
  }

}
