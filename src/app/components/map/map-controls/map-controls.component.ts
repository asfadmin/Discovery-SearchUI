import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink';

import { AppState } from '@store';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';

import * as models from '@models';
import * as services from '@services';

import { LonLat } from '@models';

@Component({
  selector: 'app-map-controls',
  templateUrl: './map-controls.component.html',
  styleUrls: ['./map-controls.component.scss']
})
export class MapControlsComponent implements OnInit, OnDestroy {
  public view$ = this.store$.select(mapStore.getMapView);
  public interactionMode$ = this.store$.select(mapStore.getMapInteractionMode);
  public drawMode$ = this.store$.select(mapStore.getMapDrawMode);

  public searchType: models.SearchType;
  public searchTypes = models.SearchType;
  public viewTypes = models.MapViewType;
  public mousePos: LonLat;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private mapService: services.MapService,
  ) { }


  ngOnInit() {
    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );

    this.subs.add(
      this.mapService.mousePosition$.subscribe(mp => this.mousePos = mp)
    );
  }

  public onNewProjection(view: models.MapViewType): void {
    this.store$.dispatch(new mapStore.SetMapView(view));
  }

  public onNewInteractionMode(mode: models.MapInteractionModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(mode));
  }

  public onNewDrawMode(mode: models.MapDrawModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(models.MapInteractionModeType.DRAW));
    this.store$.dispatch(new mapStore.SetMapDrawMode(mode));
  }

  public onClearAOI(): void {
    this.mapService.clearDrawLayer();
    this.store$.dispatch(new mapStore.SetMapInteractionMode(models.MapInteractionModeType.DRAW));
  }

  public zoomIn(): void {
    this.mapService.zoomIn();
  }

  public zoomOut(): void {
    this.mapService.zoomOut();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
