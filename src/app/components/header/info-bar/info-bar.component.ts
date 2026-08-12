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
import { Signal } from '@angular/core';
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
  public searchType: Signal<models.SearchType> = this.store$.selectSignal(
    searchStore.getSearchType,
  );
  public searchTypes = models.SearchType;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  public startDate: Signal<Date | null> = this.store$.selectSignal(
    filtersStore.getStartDate,
  );
  public endDate: Signal<Date | null> = this.store$.selectSignal(
    filtersStore.getEndDate,
  );
  public pathRange: Signal<models.Range<number | null>> =
    this.store$.selectSignal(filtersStore.getPathRange);
  public frameRange: Signal<models.Range<number | null>> =
    this.store$.selectSignal(filtersStore.getFrameRange);
  public season: Signal<models.Range<number | null>> = this.store$.selectSignal(
    filtersStore.getSeason,
  );
  public shouldOmitSearchPolygon: Signal<boolean> = this.store$.selectSignal(
    filtersStore.getShouldOmitSearchPolygon,
  );
  public listSearchMode: Signal<models.ListSearchType> =
    this.store$.selectSignal(filtersStore.getListSearchMode);
  public searchList: Signal<string[]> = this.store$.selectSignal(
    filtersStore.getSearchList,
  );
  public shortNames: string;
  public beamModes: Signal<models.DatasetBeamModes> = this.store$.selectSignal(
    filtersStore.getBeamModes,
  );
  public polarizations: models.DatasetPolarizations;
  public flightDirections: Signal<models.FlightDirection[]> =
    this.store$.selectSignal(filtersStore.getFlightDirections);
  public platforms: string;
  public mission: Signal<string> = this.store$.selectSignal(
    filtersStore.getSelectedMission,
  );
  public perpRange: Signal<models.Range<number | null>> =
    this.store$.selectSignal(filtersStore.getPerpendicularRange);
  public tempRange: Signal<models.Range<number | null>> =
    this.store$.selectSignal(filtersStore.getTemporalRange);
  public fullBurstIDs: Signal<string[]> = this.store$.selectSignal(
    filtersStore.getFullBurstIDs,
  );
  public operaBurstIDs: Signal<string[]> = this.store$.selectSignal(
    filtersStore.getOperaBurstIDs,
  );
  public useCalibrationData: Signal<boolean> = this.store$.selectSignal(
    filtersStore.getUseCalibrationData,
  );
  public groupID: Signal<string> = this.store$.selectSignal(
    filtersStore.getGroupID,
  );
  public userID: Signal<string> = this.store$.selectSignal(
    hyp3Store.getOnDemandUserId,
  );
  public sidePolarizations: models.DatasetPolarizations;
  public rangeBandwidth: Signal<string[]> = this.store$.selectSignal(
    filtersStore.getRangeBandwidth,
  );

  public instruments: Signal<string[]> = this.store$.selectSignal(
    filtersStore.getInstruments,
  );
  public frameCoverage: Signal<string[]> = this.store$.selectSignal(
    filtersStore.getFrameCoverage,
  );
  public jointObservation: Signal<boolean> = this.store$.selectSignal(
    filtersStore.getJointObservation,
  );
  public scienceProducts: Signal<string[]> = this.store$.selectSignal(
    filtersStore.getScienceProduct,
  );
  public productionConfig: Signal<string[]> = this.store$.selectSignal(
    filtersStore.getProductionConfig,
  );
  public productMaturity = this.store$.selectSignal(
    filtersStore.getProductMaturity,
  );
  public jobIds: Signal<string[]> = this.store$.selectSignal(
    hyp3Store.getHyp3JobIds,
  );
  public selectedDataset: string;
  public selectedDatasetIsNISARFormat = false;
  public ariaVersion: Signal<string> = this.store$.selectSignal(
    filtersStore.getAriaVersion,
  );
  public tileID: Signal<string> = this.store$.selectSignal(
    filtersStore.getTileID,
  );
  public granuleList = this.store$.selectSignal(filtersStore.getGranuleList);
  public granuleListMinified = computed(() => {
    return this.granuleList().split(',').length;
  });

  public eventProductTypes: string;
  public productTypes: string;

  private subs = new SubSink();

  public hyp3Default = this.hyp3.isDefaultApi();
  public hyp3Url = this.hyp3.apiUrl;
  public hyp3BaseUrl = this.hyp3.baseUrl;
  public hyp3BackendUrl: string;

  public dataset = this.store$.selectSignal(filtersStore.getSelectedDataset);

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

    const platformsSub = this.store$
      .select(filtersStore.getPlatforms)
      .subscribe(
        (platforms) =>
          (this.platforms = platforms
            .map((platform) => platform.apiValue)
            .join(',')),
      );

    const eventProductType = this.store$
      .select(filtersStore.getHyp3ProductTypes)
      .subscribe(
        (productTypes) =>
          (this.eventProductTypes = productTypes
            .map((productType) => productType.id)
            .join(', ')),
      );

    [
      productTypesSub,
      shortNamesSub,
      polsSub,
      sidePolsSub,
      platformsSub,
      eventProductType,
    ].forEach((sub) => this.subs.add(sub));

    this.subs.add(
      this.store$.select(userStore.getUserProfile).subscribe((profile) => {
        this.hyp3BackendUrl = profile.hyp3BackendUrl;
        if (!this.hyp3BackendUrl) {
          this.hyp3BackendUrl = this.hyp3.apiUrl;
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
