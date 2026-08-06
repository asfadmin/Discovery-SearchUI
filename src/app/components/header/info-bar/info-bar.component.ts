import { Component, OnInit, OnDestroy, inject, computed } from '@angular/core';

import { Store } from '@ngrx/store';
import { SubSink } from 'subsink';

import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';
import * as filtersStore from '@store/filters';
import * as searchStore from '@store/search';

import * as services from '@services';
import * as models from '@models';
import * as userStore from '@store/user';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Hyp3UrlComponent } from '@components/shared/hyp3-url/hyp3-url.component';
import { ShortDatePipe } from '@pipes/short-date.pipe';
import { JoinPipe } from '@pipes/join.pipe';
import { TranslateModule } from '@ngx-translate/core';

// Declare GTM dataLayer array.
declare global {
  interface Window {
    dataLayer: any[];
  }
}

@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.scss'],
  imports: [
    Hyp3UrlComponent,
    AsyncPipe,
    TitleCasePipe,
    ShortDatePipe,
    JoinPipe,
    TranslateModule,
  ],
})
export class InfoBarComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(services.ScreenSizeService);
  private hyp3 = inject(services.Hyp3ApiService);
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
  public shortNames: string;
  public beamModes: models.DatasetBeamModes;
  public polarizations: models.DatasetPolarizations;
  public flightDirections: models.FlightDirection[];
  public platforms: string;
  public mission: string;
  public perpRange: models.Range<number | null>;
  public tempRange: models.Range<number | null>;
  public fullBurstIDs: string[] = [];
  public operaBurstIDs: string[] = [];
  public useCalibrationData = false;
  public groupID: string;
  public userID: string;
  public sidePolarizations: models.DatasetPolarizations;
  public rangeBandwidth: string[];
  public instruments: string[];
  public frameCoverage: string[];
  public jointObservation: boolean;
  public scienceProducts: string[];
  public productionConfig: string[];
  public productMaturity = this.store$.selectSignal(
    filtersStore.getProductMaturity,
  );
  public jobIds: string[];
  public selectedDataset: string;
  public selectedDatasetIsNISARFormat = false;
  public ariaVersion: string;
  public tileID: string;
  public granuleList = this.store$.selectSignal(filtersStore.getGranuleList);
  public granuleListMinified = computed(() => {
    return this.granuleList().split(',').length;
  });

  private subs = new SubSink();

  public hyp3Default = this.hyp3.isDefaultApi();
  public hyp3Url = this.hyp3.apiUrl;
  public hyp3BaseUrl = this.hyp3.baseUrl;
  public hyp3BackendUrl: string;

  public dataset = '';

  public maxStringLength = 30;
  ngOnInit() {
    this.subs.add(
      this.store$
        .select(filtersStore.getSelectedDatasetId)
        .subscribe((selected) => {
          this.selectedDataset = selected;
          if (this.selectedDataset === 'SENTINEL-1 INTERFEROGRAM (BETA)') {
            this.selectedDatasetIsNISARFormat = true;
          } else {
            this.selectedDatasetIsNISARFormat = false;
          }
        }),
    );
    const startSub = this.store$
      .select(filtersStore.getStartDate)
      .subscribe((start) => (this.startDate = start));
    const endSub = this.store$
      .select(filtersStore.getEndDate)
      .subscribe((end) => (this.endDate = end));
    const pathSub = this.store$
      .select(filtersStore.getPathRange)
      .subscribe((pathRange) => (this.pathRange = pathRange));
    const frameSub = this.store$
      .select(filtersStore.getFrameRange)
      .subscribe((frameRange) => (this.frameRange = frameRange));
    const seasonSub = this.store$
      .select(filtersStore.getSeason)
      .subscribe((season) => (this.season = season));
    const omitSub = this.store$
      .select(filtersStore.getShouldOmitSearchPolygon)
      .subscribe((shouldOmit) => (this.shouldOmitSearchPolygon = shouldOmit));
    const listSearchModeSub = this.store$
      .select(filtersStore.getListSearchMode)
      .subscribe((listSearchMode) => (this.listSearchMode = listSearchMode));
    const searchListSub = this.store$
      .select(filtersStore.getSearchList)
      .subscribe((searchList) => (this.searchList = searchList));
    const productTypesSub = this.store$
      .select(filtersStore.getProductTypes)
      .subscribe(
        (productTypes) =>
          (this.productTypes = productTypes
            .map((productType) => productType.apiValue)
            .join(',')),
      );
    const shortNamesSub = this.store$
      .select(filtersStore.getShortNames)
      .subscribe(
        (shortNames) =>
          (this.shortNames = shortNames
            .map((shortName) => shortName.apiValue)
            .join(',')),
      );
    const polsSub = this.store$
      .select(filtersStore.getPolarizations)
      .subscribe(
        (pols) =>
          (this.polarizations = pols.map((x) => x.replaceAll(',', '+'))),
      );
    const sidePolsSub = this.store$
      .select(filtersStore.getSidePolarizations)
      .subscribe(
        (sidePols) =>
          (this.sidePolarizations = sidePols.map((x) =>
            x.replaceAll(',', '+'),
          )),
      );
    const instrumentSub = this.store$
      .select(filtersStore.getInstruments)
      .subscribe((instruments) => (this.instruments = instruments));
    const frameCoverageSub = this.store$
      .select(filtersStore.getFrameCoverage)
      .subscribe((frameCoverage) => (this.frameCoverage = frameCoverage));
    const rangeBandwidthSub = this.store$
      .select(filtersStore.getRangeBandwidth)
      .subscribe((rangeBandwidth) => (this.rangeBandwidth = rangeBandwidth));
    const jointObservationSub = this.store$
      .select(filtersStore.getJointObservation)
      .subscribe(
        (jointObservation) => (this.jointObservation = jointObservation),
      );
    const beamModesSub = this.store$
      .select(filtersStore.getBeamModes)
      .subscribe((beamModes) => (this.beamModes = beamModes));
    const flightDirsSub = this.store$
      .select(filtersStore.getFlightDirections)
      .subscribe((flightDirs) => (this.flightDirections = flightDirs));
    const platformsSub = this.store$
      .select(filtersStore.getPlatforms)
      .subscribe(
        (platforms) =>
          (this.platforms = platforms
            .map((platform) => platform.apiValue)
            .join(',')),
      );
    const missionSub = this.store$
      .select(filtersStore.getSelectedMission)
      .subscribe((mission) => (this.mission = mission));
    const perpSub = this.store$
      .select(filtersStore.getPerpendicularRange)
      .subscribe((range) => (this.perpRange = range));
    const tempSub = this.store$
      .select(filtersStore.getTemporalRange)
      .subscribe((range) => (this.tempRange = range));

    const eventProductType = this.store$
      .select(filtersStore.getHyp3ProductTypes)
      .subscribe(
        (productTypes) =>
          (this.eventProductTypes = productTypes
            .map((productType) => productType.id)
            .join(', ')),
      );

    const fullBurstIDSub = this.store$
      .select(filtersStore.getFullBurstIDs)
      .subscribe((burstIDs) => (this.fullBurstIDs = burstIDs));

    const operaBurstIDSub = this.store$
      .select(filtersStore.getOperaBurstIDs)
      .subscribe((burstIDs) => (this.operaBurstIDs = burstIDs));

    const useCalibrationDataSub = this.store$
      .select(filtersStore.getUseCalibrationData)
      .subscribe(
        (useCalibrationData) => (this.useCalibrationData = useCalibrationData),
      );

    const tileIDSub = this.store$
      .select(filtersStore.getTileID)
      .subscribe((tile) => (this.tileID = tile));

    const groupIDSub = this.store$
      .select(filtersStore.getGroupID)
      .subscribe((groupID) => (this.groupID = groupID));

    const userIDSub = this.store$
      .select(hyp3Store.getOnDemandUserId)
      .subscribe((userID) => (this.userID = userID));

    const jobIdsSub = this.store$
      .select(hyp3Store.getHyp3JobIds)
      .subscribe((jobIds) => (this.jobIds = jobIds));

    const scienceProductsSub = this.store$
      .select(filtersStore.getScienceProduct)
      .subscribe((scienceProducts) => (this.scienceProducts = scienceProducts));

    const productionConfigSub = this.store$
      .select(filtersStore.getProductionConfig)
      .subscribe(
        (productionConfig) => (this.productionConfig = productionConfig),
      );

    const ariaVersionSub = this.store$
      .select(filtersStore.getAriaVersion)
      .subscribe((version) => (this.ariaVersion = version));
    [
      startSub,
      endSub,
      pathSub,
      frameSub,
      seasonSub,
      omitSub,
      listSearchModeSub,
      searchListSub,
      productTypesSub,
      shortNamesSub,
      polsSub,
      sidePolsSub,
      instrumentSub,
      frameCoverageSub,
      rangeBandwidthSub,
      jointObservationSub,
      beamModesSub,
      flightDirsSub,
      platformsSub,
      missionSub,
      tempSub,
      perpSub,
      eventProductType,
      fullBurstIDSub,
      operaBurstIDSub,
      useCalibrationDataSub,
      groupIDSub,
      userIDSub,
      productionConfigSub,
      scienceProductsSub,
      jobIdsSub,
      ariaVersionSub,
      tileIDSub,
    ].forEach((sub) => this.subs.add(sub));

    this.subs.add(
      this.store$
        .select(searchStore.getSearchType)
        .subscribe((searchType) => (this.searchType = searchType)),
    );

    this.subs.add(
      this.store$.select(userStore.getUserProfile).subscribe((profile) => {
        this.hyp3BackendUrl = profile.hyp3BackendUrl;
        if (!this.hyp3BackendUrl) {
          this.hyp3BackendUrl = this.hyp3.apiUrl;
        }
      }),
    );

    this.subs.add(
      this.store$
        .select(filtersStore.getSelectedDataset)
        .subscribe((dataset) => (this.dataset = dataset.id)),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
