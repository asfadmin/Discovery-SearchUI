import { Component, Input, OnInit, OnDestroy  } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import * as models from '@models';
import { PropertyService, ScreenSizeService } from '@services';

enum FilterPanel {
  DATE = 'Date',
  ADDITIONAL = 'Additional',
  CAMPAIGN = 'Campaign',
  PATH = 'Path',
  AOI = 'Aoi'
}

@Component({
  selector: 'app-dataset-filters',
  templateUrl: './dataset-filters.component.html',
  styleUrls: ['./dataset-filters.component.scss']
})
export class DatasetFiltersComponent implements OnInit, OnDestroy {
  @Input() dataset: models.CMRProduct;
  @Input() selectedPanel: FilterPanel | null = null;

  panels = FilterPanel;
  defaultPanelOpenState = true;
  panelIsDisabled = true;
  customCollapsedHeight = '30px';
  customExpandedHeight = '30px';

  public datasets = models.datasetList;
  public selectedDataset: string;
  public p = models.Props;
  public missionsByDataset$ = this.store$.select(filtersStore.getMissionsByDataset);
  public selectedMission$ = this.store$.select(filtersStore.getSelectedMission);
  public missionDatasets$ = this.missionsByDataset$.pipe(
    map(missions => Object.keys(missions))
  );
  public dataset$ = this.store$.select(filtersStore.getSelectedDataset);

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  private subs = new SubSink();

  constructor(
    public prop: PropertyService,
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService
  ) {}

  ngOnInit() {
    this.subs.add(
      this.store$.select(filtersStore.getSelectedDatasetId).subscribe(
        selected => this.selectedDataset = selected
      )
    );
  }

  public onNewMissionSelected(selectedMission: string): void {
    this.store$.dispatch(new filtersStore.SelectMission(selectedMission));
  }

  public onDatasetChange(dataset: string): void {
    this.store$.dispatch(new filtersStore.SetSelectedDataset(dataset));
  }

  public isSelected(panel: FilterPanel): boolean {
    return this.selectedPanel === panel;
  }

  public selectPanel(panel: FilterPanel): void {
    this.selectedPanel = panel;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
