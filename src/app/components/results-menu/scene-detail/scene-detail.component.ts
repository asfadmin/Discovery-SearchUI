import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { fromEvent } from 'rxjs';
import { map, withLatestFrom, filter, tap, debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as filtersStore from '@store/filters';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';

import * as models from '@models';
import { DatapoolAuthService, PropertyService, ScreenSizeService } from '@services';
import { ImageDialogComponent } from './image-dialog';

@Component({
  selector: 'app-scene-detail',
  templateUrl: './scene-detail.component.html',
  styleUrls: ['./scene-detail.component.scss']
})
export class SceneDetailComponent implements OnInit {
  public dataset: models.Dataset;
  public searchType: models.SearchType;
  public scene: models.CMRProduct;
  public sceneLen: number;

  public p = models.Props;

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    public dialog: MatDialog,
    public authService: DatapoolAuthService,
    public prop: PropertyService,
  ) {}

  ngOnInit() {
    const scene$ = this.store$.select(scenesStore.getSelectedScene);

    this.screenSize.size$.pipe(
      map(size => size.width > 1750 ? 32 : 16),
    ).subscribe(len => this.sceneLen = len);

    scene$.subscribe(
      scene => this.scene = scene
    );

    scene$.pipe(
      filter(g => !!g),
      map(scene => this.datasetFor(scene)),
    ).subscribe(dataset => this.dataset = dataset);

   this.store$.select(uiStore.getSearchType).subscribe(
     searchType => this.searchType = searchType
   );
  }

  private datasetFor(granule: models.CMRProduct): models.Dataset {
    const exact = (dataset, granuleDataset) => (
      dataset.id.toLowerCase() === granuleDataset
    );

    const partial = (dataset, granuleDataset) => (
      dataset.id.toLowerCase().includes(granuleDataset) ||
      granuleDataset.includes(dataset.id.toLowerCase())
    );

    const subtype = (dataset, granuleDataset) => (
      dataset.subtypes.length ?
        dataset.subtypes.filter(st => st.apiValue.toLowerCase() === granuleDataset) : null
    );

    return (
      this.getDatasetMatching(granule, exact) ||
      this.getDatasetMatching(granule, partial) ||
      this.getDatasetMatching(granule, subtype) ||
      models.datasets[0]
    );
  }

  private getDatasetMatching(
    granule: models.CMRProduct,
    comparator: (dataset: models.Dataset, granuleDataset: string) => boolean
  ): models.Dataset {
    return  models.datasets
      .filter(dataset => {
        const granuleDataset = granule.dataset.toLocaleLowerCase();

        return comparator(dataset, granuleDataset);
      })[0];
  }

  public onOpenImage(scene: models.CMRProduct): void {
    this.dialog.open(ImageDialogComponent, {
      width: '1200px', height: '1200px',
      maxWidth: '90%', maxHeight: '90%',
      panelClass: 'image-dialog'
    });
  }

  public isGeoSearch(): boolean {
    return this.searchType === models.SearchType.DATASET;
  }

  public hasValue(v: any): boolean {
    return v !== null && v !== undefined;
  }

  public setBeamMode(): void {
    const action = new filtersStore.AddBeamMode(this.scene.metadata.beamMode);
    this.store$.dispatch(action);
  }

  public setStartDate(): void {
    const action = new filtersStore.SetStartDate(this.scene.metadata.date.toDate());
    this.store$.dispatch(action);
  }

  public setEndDate(): void {
    const action = new filtersStore.SetEndDate(this.scene.metadata.date.toDate());
    this.store$.dispatch(action);
  }

  public setPathStart(): void {
    const action = new filtersStore.SetPathStart(this.scene.metadata.path);
    this.store$.dispatch(action);
  }

  public setPathEnd(): void {
    const action = new filtersStore.SetPathEnd(this.scene.metadata.path);
    this.store$.dispatch(action);
  }

  public setFrameStart(): void {
    const action = new filtersStore.SetFrameStart(this.scene.metadata.frame);
    this.store$.dispatch(action);
  }

  public setFrameEnd(): void {
    const action = new filtersStore.SetFrameEnd(this.scene.metadata.frame);
    this.store$.dispatch(action);
  }

  public setFlightDirection(): void {
    const dir = this.scene.metadata.flightDirection
      .toLowerCase();

    const capitalized = this.capitalizeFirstLetter(dir);

    const action = new filtersStore.SetFlightDirections([<models.FlightDirection>capitalized]);
    this.store$.dispatch(action);
  }

  public addPolarization(): void {
    const action = new filtersStore.AddPolarization(this.scene.metadata.polarization);
    this.store$.dispatch(action);
  }

  public addMission(): void {
    const action = new filtersStore.SelectMission(this.scene.metadata.missionName);
    this.store$.dispatch(action);
  }

  public findSimilarScenes(): void {
    this.setPathStart();
    this.setPathEnd();
    this.setFrameStart();
    this.setFrameEnd();
    this.store$.dispatch(new searchStore.MakeSearch());
  }

  private capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
