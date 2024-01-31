import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { SubSink } from 'subsink';

import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';
import * as filtersStore from '@store/filters';
import * as searchStore from '@store/search';

import * as services from '@services';
import * as models from '@models';
import * as userStore from '@store/user';

// Declare GTM dataLayer array.
declare global {
  interface Window { dataLayer: any[]; }
}

@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.scss'],
})
export class InfoBarComponent implements OnInit, OnDestroy {
  public searchType: models.SearchType = models.SearchType.DATASET;
  public searchTypes = models.SearchType;
  public searchType$ = this.store$.select(searchStore.getSearchType);
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  public startDate: Date | null;
  public endDate: Date | null;
  public eventProductTypes: string;
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
  public fullBurstIDs: string[] = [];
  public operaBurstIDs: string[] = [];
  public useCalibrationData: boolean = false;
  public groupID: string;
  public userID: string;

  private subs = new SubSink();

  public hyp3Default = this.hyp3.isDefaultApi();
  public hyp3Url = this.hyp3.apiUrl;
  public hyp3BaseUrl = this.hyp3.baseUrl;
  public hyp3BackendUrl: string;

  public dataset: String = ''

  constructor(
    private store$: Store<AppState>,
    private screenSize: services.ScreenSizeService,
    private hyp3: services.Hyp3Service,
  ) {
  }
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

    const eventProductType = this.store$.select(filtersStore.getHyp3ProductTypes).subscribe(
      productTypes => this.eventProductTypes = productTypes
        .map(productType => productType.id)
        .join(', ')
    );

    const fullBurstIDSub = this.store$.select(filtersStore.getFullBurstIDs).subscribe(
      burstIDs => this.fullBurstIDs = burstIDs
    );

    const operaBurstIDSub = this.store$.select(filtersStore.getOperaBurstIDs).subscribe(
      burstIDs => this.operaBurstIDs = burstIDs
    );

    const useCalibrationDataSub = this.store$.select(filtersStore.getUseCalibrationData).subscribe(
      useCalibrationData => this.useCalibrationData = useCalibrationData
    );

    const groupIDSub = this.store$.select(filtersStore.getGroupID).subscribe(
      groupID => this.groupID = groupID
    );

    const userIDSub = this.store$.select(hyp3Store.getOnDemandUserId).subscribe(
      userID => this.userID = userID
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
      tempSub, perpSub,
      eventProductType,
      fullBurstIDSub,
      operaBurstIDSub,
      useCalibrationDataSub,
      groupIDSub,
      userIDSub
    ].forEach(sub => this.subs.add(sub));

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );

    this.subs.add(
      this.store$.select(userStore.getUserProfile).subscribe(
        profile => {
          this.hyp3BackendUrl = profile.hyp3BackendUrl;
          if (this.hyp3BackendUrl) {
            this.hyp3.setApiUrl(this.hyp3BackendUrl);
          } else {
            this.hyp3BackendUrl = this.hyp3.apiUrl;
          }
        }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getSelectedDataset).subscribe(
        dataset => this.dataset = dataset.id
      )
    )
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
