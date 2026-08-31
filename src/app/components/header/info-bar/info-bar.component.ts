import { Component, inject, computed } from '@angular/core';

import { Store } from '@ngrx/store';

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
export class InfoBarComponent {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(services.ScreenSizeService);
  private hyp3 = inject(services.Hyp3ApiService);

  public searchTypes = models.SearchType;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  public searchType: Signal<models.SearchType> = this.store$.selectSignal(
    searchStore.getSearchType,
  );
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
  public beamModes: Signal<models.DatasetBeamModes> = this.store$.selectSignal(
    filtersStore.getBeamModes,
  );
  public flightDirections: Signal<models.FlightDirection[]> =
    this.store$.selectSignal(filtersStore.getFlightDirections);
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
  private productTypeBase = this.store$.selectSignal(
    filtersStore.getProductTypes,
  );
  public productTypes: Signal<string> = computed(() => {
    return this.productTypeBase()
      .map((productType) => productType.apiValue)
      .join(',');
  });
  private shortNameBase = this.store$.selectSignal(filtersStore.getShortNames);
  public shortNames: Signal<string> = computed(() => {
    return this.shortNameBase()
      .map((shortName) => shortName.apiValue)
      .join(',');
  });
  private polarizationsBase = this.store$.selectSignal(
    filtersStore.getPolarizations,
  );
  public polarizations: Signal<models.DatasetPolarizations> = computed(() => {
    return this.polarizationsBase().map((x) => x.replaceAll(',', '+'));
  });
  private sidePolarizationsBase = this.store$.selectSignal(
    filtersStore.getSidePolarizations,
  );
  public sidePolarizations: Signal<models.DatasetPolarizations> = computed(
    () => {
      return this.sidePolarizationsBase().map((x) => x.replaceAll(',', '+'));
    },
  );
  private platformsBase = this.store$.selectSignal(filtersStore.getPlatforms);
  public platforms: Signal<string> = computed(() => {
    return this.platformsBase()
      .map((platform) => platform.apiValue)
      .join(',');
  });
  private userProfile: Signal<models.UserProfile> = this.store$.selectSignal(
    userStore.getUserProfile,
  );
  public hyp3BackendUrl: Signal<string> = computed(() => {
    if (!this.userProfile().hyp3BackendUrl) {
      return this.hyp3.apiUrl;
    }
    return this.userProfile().hyp3BackendUrl;
  });
  public useTrack: Signal<boolean> = computed(() => {
    return this.dataset().properties.includes(models.Props.USE_TRACK);
  });

  public hyp3Default = this.hyp3.isDefaultApi();
  public hyp3Url = this.hyp3.apiUrl;
  public hyp3BaseUrl = this.hyp3.baseUrl;

  public dataset = this.store$.selectSignal(filtersStore.getSelectedDataset);

  public maxStringLength = 30;
}
