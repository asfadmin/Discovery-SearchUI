import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { map, filter, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as filtersStore from '@store/filters';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';

import * as models from '@models';
import { AuthService, PropertyService, ScreenSizeService } from '@services';
import { ImageDialogComponent } from './image-dialog';

import { DatasetForProductService } from '@services';

@Component({
  selector: 'app-scene-detail',
  templateUrl: './scene-detail.component.html',
  styleUrls: ['./scene-detail.component.scss'],
  providers: [ DatasetForProductService ]
})
export class SceneDetailComponent implements OnInit, OnDestroy {
  public browses$ = this.store$.select(scenesStore.getSelectedSceneBrowses);
  public dataset: models.Dataset;
  public searchType: models.SearchType;
  public searchTypes = models.SearchType;
  public scene: models.CMRProduct;
  public sceneLen: number;
  public p = models.Props;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public isImageLoading = false;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    public dialog: MatDialog,
    public authService: AuthService,
    public prop: PropertyService,
    private datasetForProduct: DatasetForProductService
  ) {}

  ngOnInit() {
    const scene$ = this.store$.select(scenesStore.getSelectedScene).pipe(
      tap(_ => this.isImageLoading = true)
    );

    this.subs.add(
      this.screenSize.size$.pipe(
        map(size => size.width > 1750 ? 32 : 16),
      ).subscribe(len => this.sceneLen = len)
    );

    this.subs.add(
      scene$.pipe(
        tap(scene => this.scene = scene),
        filter(scene => !!scene),
        map(scene => this.datasetForProduct.match(scene)),
      ).subscribe(dataset => this.dataset = dataset)
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );
  }

  public sceneHasBrowse() {
    return !this.scene.browses[0].includes('no-browse');
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
    return  models.datasetList
      .filter(dataset => {
        const granuleDataset = granule.dataset.toLocaleLowerCase();

        return comparator(dataset, granuleDataset);
      })[0];
  }

  public onOpenImage(): void {
    if (!this.sceneHasBrowse()) {
      return;
    }

    this.store$.dispatch(new uiStore.SetIsBrowseDialogOpen(true));

    const dialogRef = this.dialog.open(ImageDialogComponent, {
      width: '99%',
      maxWidth: '99%',
      height: '99%',
      maxHeight: '99%',
      panelClass: 'image-dialog'
    });

    this.subs.add(
      dialogRef.afterClosed().subscribe(
        _ => this.store$.dispatch(new uiStore.SetIsBrowseDialogOpen(false))
      )
    );
  }

  public onSetSelectedAsMaster() {
    this.store$.dispatch(new scenesStore.SetMaster(this.scene.name));
  }

  public findSimilarScenes(): void {
    const scene = this.scene;

    [
      new searchStore.SetSearchType(models.SearchType.DATASET),
      new filtersStore.SetFiltersSimilarTo(scene),
      new searchStore.MakeSearch()
    ].forEach(action => this.store$.dispatch(action));
  }

  public makeBaselineSearch(): void {
    const sceneName = this.scene.name;
    [
      new searchStore.ClearSearch(),
      new searchStore.SetSearchType(models.SearchType.BASELINE),
      new scenesStore.SetFilterMaster(sceneName),
      new searchStore.MakeSearch()
    ].forEach(action => this.store$.dispatch(action));
  }

  private capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
