import { NgClass, AsyncPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import GeoJSON from 'ol/format/GeoJSON';

import { SearchButtonComponent } from '@components/shared/search-button/search-button.component';
import { DatasetSelectorComponent } from '@components/shared/selectors/dataset-selector/dataset-selector.component';
import { DateSelectorComponent } from '@components/shared/selectors/date-selector/date-selector.component';
import { SearchTypeSelectorComponent } from '@components/shared/selectors/search-type-selector/search-type-selector.component';
import * as models from '@models';
import * as services from '@services';
import { AppState } from '@store';
import * as filterStore from '@store/filters';
import * as queueStore from '@store/queue';
import * as uiStore from '@store/ui';

import { AoiFilterComponent } from '../dataset-header/aoi-filter/aoi-filter.component';
import { HeaderButtonsComponent } from '../header-buttons/header-buttons.component';

@Component({
  selector: 'app-pair-selection-header',
  templateUrl: './pair-selection-header.component.html',
  styleUrls: [
    './pair-selection-header.component.scss',
    '../header.component.scss',
  ],
  imports: [
    SearchTypeSelectorComponent,
    DatasetSelectorComponent,
    MatIcon,
    AoiFilterComponent,
    NgClass,
    DateSelectorComponent,
    MatButton,
    SearchButtonComponent,
    HeaderButtonsComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class PairSelectionHeaderComponent implements OnInit {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(services.ScreenSizeService);
  prop = inject(services.PropertyService);
  frameMapService = inject(services.FrameMapService);
  private injector = inject(Injector);
  private drawService = inject(services.DrawService);
  private searchParams = inject(services.SearchParamsService);
  private pairSelectionService = inject(services.PairSelectionService);
  private mapService = inject(services.MapService);

  public datasets = models.datasetList;
  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts);
  public breakpoint$ = this.screenSize.breakpoint$;
  public frameSelectionEnabled$ = this.store$.select(
    uiStore.getIsFrameSelectionEnabled,
  );
  public breakpoints = models.Breakpoints;
  public dataset = this.store$.selectSignal(filterStore.getSelectedDataset);
  public p = models.Props;

  private searchPolygon = toSignal(this.drawService.polygon$);
  private latestParams = toSignal(this.searchParams.getlatestParams);
  public pairSelectionDatasets = computed(() => {
    return this.datasets.filter((dataset) =>
      dataset.properties.includes(models.Props.PAIR_SELECTION),
    );
  });

  public frameMapRequest = httpResource.text(() => {
    const polygon = this.searchPolygon();
    const params = this.latestParams();
    if (polygon === null) {
      return;
    }
    return {
      url: models.datasets['SENTINEL-1 INTERFEROGRAM (BETA)'].frameMap
        .ascending,
      params: {
        ...params,
        polygon,
        output: 'something',
      },
    };
  });

  public testingPathRange = this.store$.selectSignal(
    filterStore.getPathFrameRanges,
  );

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.OpenFiltersMenu());
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }

  public closeAOIOptions(): void {
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }

  public onDatasetChange(dataset: string): void {
    this.store$.dispatch(new filterStore.SetSelectedDataset(dataset));
  }

  public ngOnInit(): void {
    effect(
      () => {
        if (
          !this.frameMapRequest.hasValue() &&
          !this.frameMapRequest.isLoading()
        ) {
          return;
        }

        const features = new GeoJSON().readFeatures(
          this.frameMapRequest.value(),
          {
            featureProjection: this.mapService.epsg(),
          },
        );
        // TODO: for now this is just acting like how SearchAPI would be filtering
        const filteredFeatures = this.pairSelectionService.tempAriaMapFilter(
          features,
          this.latestParams(),
          this.searchPolygon(),
          this.testingPathRange(),
        );

        this.pairSelectionService.loadFramePreview(filteredFeatures);
      },
      { injector: this.injector },
    );
  }
}
