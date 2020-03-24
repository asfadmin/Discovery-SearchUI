import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { SubSink } from 'subsink';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import * as services from '@services';
import * as models from '@models';

@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.scss']
})
export class InfoBarComponent implements OnInit, OnDestroy {
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  public startDate: Date | null;
  public endDate: Date | null;
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
  public mission: string;
  public perpRange: models.Range<number | null>;
  public tempRange: models.Range<number | null>;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private screenSize: services.ScreenSizeService
  ) { }

  ngOnInit() {
    const startSub = this.store$.select(filtersStore.getStartDate).subscribe(
      start => this.startDate = start
    );
    const endSub = this.store$.select(filtersStore.getEndDate).subscribe(
      end => this.endDate = end
    );
    const pathSub = this.store$.select(filtersStore.getPathRange).subscribe(
      pathRange => this.pathRange = pathRange
    );
    const frameSub = this.store$.select(filtersStore.getFrameRange).subscribe(
      frameRange => this.frameRange = frameRange
    );
    const seasonSub = this.store$.select(filtersStore.getSeason).subscribe(
      season => this.season = season
    );
    const omitSub = this.store$.select(filtersStore.getShouldOmitSearchPolygon).subscribe(
      shouldOmit  => this.shouldOmitSearchPolygon = shouldOmit
    );
    const listSearchModeSub = this.store$.select(filtersStore.getListSearchMode).subscribe(
      listSearchMode  => this.listSearchMode = listSearchMode
    );
    const searchListSub = this.store$.select(filtersStore.getSearchList).subscribe(
      searchList  => this.searchList = searchList
    );
    const productTypesSub = this.store$.select(filtersStore.getProductTypes).subscribe(
      productTypes => this.productTypes = productTypes
        .map(subtype => subtype.apiValue)
        .join(',')
    );
    const polsSub = this.store$.select(filtersStore.getPolarizations).subscribe(
      pols  => this.polarizations = pols
    );
    const beamModesSub = this.store$.select(filtersStore.getBeamModes).subscribe(
      beamModes => this.beamModes = beamModes
    );
    const flightDirsSub = this.store$.select(filtersStore.getFlightDirections).subscribe(
      flightDirs  => this.flightDirections = flightDirs
    );
    const subtypeSub = this.store$.select(filtersStore.getSubtypes).subscribe(
      subtypes => this.subtypes = subtypes
        .map(subtype => subtype.apiValue)
        .join(',')
    );
    const missionSub = this.store$.select(filtersStore.getSelectedMission).subscribe(
      mission => this.mission = mission
    );
    const perpSub = this.store$.select(filtersStore.getPerpendicularRange).subscribe(
      range => this.perpRange = range
    );
    const tempSub = this.store$.select(filtersStore.getTemporalRange).subscribe(
      range => this.tempRange = range
    );

    [
      startSub, endSub,
      pathSub, frameSub,
      seasonSub,
      omitSub,
      listSearchModeSub, searchListSub,
      productTypesSub,
      polsSub,
      beamModesSub,
      flightDirsSub,
      subtypeSub,
      missionSub,
      tempSub, perpSub
    ].forEach(sub => this.subs.add(sub));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
