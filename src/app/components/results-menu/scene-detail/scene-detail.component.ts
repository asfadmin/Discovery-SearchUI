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

import { DatasetForProductService } from '@services';

@Component({
  selector: 'app-scene-detail',
  templateUrl: './scene-detail.component.html',
  styleUrls: ['./scene-detail.component.scss'],
  providers: [ DatasetForProductService ]
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
    private datasetForProduct: DatasetForProductService
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
      map(scene => this.datasetForProduct.match(scene)),
    ).subscribe(dataset => this.dataset = dataset);

   this.store$.select(uiStore.getSearchType).subscribe(
     searchType => this.searchType = searchType
   );
  }

  public sceneHasBrowse() {
    return !this.scene.browses[0].includes('no-browse');
  }

  public onOpenImage(): void {
    if (!this.sceneHasBrowse()) {
      return;
    }

    this.store$.dispatch(new uiStore.SetIsBrowseDialogOpen(true));

    const dialogRef = this.dialog.open(ImageDialogComponent, {
      width: '99vw', height: 'fit-content',
      maxHeight: '96vh',
      panelClass: 'image-dialog'
    });

    dialogRef.afterClosed().subscribe(
      _ => this.store$.dispatch(new uiStore.SetIsBrowseDialogOpen(false))
    );
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
