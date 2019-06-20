import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as granulesStore from '@store/granules';
import * as filtersStore from '@store/filters';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';

import * as models from '@models';
import { DatapoolAuthService, PropertyService } from '@services';
import { ImageDialogComponent } from './image-dialog';

@Component({
  selector: 'app-granule-detail',
  templateUrl: './granule-detail.component.html',
  styleUrls: ['./granule-detail.component.scss']
})
export class GranuleDetailComponent implements OnInit {
  public dataset: models.Dataset;
  public searchType: models.SearchType;
  public granule: models.CMRProduct;

  public p = models.Props;

  constructor(
    private store$: Store<AppState>,
    public dialog: MatDialog,
    public authService: DatapoolAuthService,
    public prop: PropertyService,
  ) {}

  ngOnInit() {
    const granule$ = this.store$.select(granulesStore.getSelectedGranule);

    granule$.subscribe(
      granule => this.granule = granule
    );

    granule$.pipe(
      filter(g => !!g),
      map(granule => models.datasets
        .filter(dataset =>
          dataset.name.toLowerCase().includes(granule.dataset.toLocaleLowerCase()) ||
          granule.dataset.toLocaleLowerCase().includes(dataset.name.toLowerCase())
        )[0] || models.datasets[0],
      ),
    ).subscribe(dataset => this.dataset = dataset);

   this.store$.select(uiStore.getSearchType).subscribe(
     searchType => this.searchType = searchType
   );
  }

  public onOpenImage(granule: models.CMRProduct): void {
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
    const action = new filtersStore.AddBeamMode(this.granule.metadata.beamMode);
    this.store$.dispatch(action);
  }

  public setStartDate(): void {
    const action = new filtersStore.SetStartDate(this.granule.metadata.date);
    this.store$.dispatch(action);
  }

  public setEndDate(): void {
    const action = new filtersStore.SetEndDate(this.granule.metadata.date);
    this.store$.dispatch(action);
  }

  public setPathStart(): void {
    const action = new filtersStore.SetPathStart(this.granule.metadata.path);
    this.store$.dispatch(action);
  }

  public setPathEnd(): void {
    const action = new filtersStore.SetPathEnd(this.granule.metadata.path);
    this.store$.dispatch(action);
  }

  public setFrameStart(): void {
    const action = new filtersStore.SetFrameStart(this.granule.metadata.frame);
    this.store$.dispatch(action);
  }

  public setFrameEnd(): void {
    const action = new filtersStore.SetFrameEnd(this.granule.metadata.frame);
    this.store$.dispatch(action);
  }

  public setFlightDirection(): void {
    const dir = this.granule.metadata.flightDirection
      .toLowerCase();

    const capitalized = this.capitalizeFirstLetter(dir);

    const action = new filtersStore.SetFlightDirections([<models.FlightDirection>capitalized]);
    this.store$.dispatch(action);
  }

  public addPolarization(): void {
    const action = new filtersStore.AddPolarization(this.granule.metadata.polarization);
    this.store$.dispatch(action);
  }

  public findSimilarGranules(): void {
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
