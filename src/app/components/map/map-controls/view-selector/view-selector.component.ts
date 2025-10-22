import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as mapStore from '@store/map';

import { MapViewType } from '@models';

// Declare GTM dataLayer array.
declare global {
  interface Window {
    dataLayer: any[];
  }
}

@Component({
    selector: 'app-view-selector',
    templateUrl: './view-selector.component.html',
    styleUrls: ['./view-selector.component.scss'],
    standalone: false
})
export class ViewSelectorComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);

  public view: MapViewType;
  public types = MapViewType;
  private subs = new SubSink();

  ngOnInit() {
    this.subs.add(
      this.store$.select(mapStore.getMapView).subscribe((view) => {
        this.view = view;
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'map-view',
          'map-view': this.view,
        });
      }),
    );
  }

  public onArcticSelected = () => this.onNewProjection(MapViewType.ARCTIC);

  public onEquatorialSelected = () =>
    this.onNewProjection(MapViewType.EQUATORIAL);

  public onAntarcticSelected = () =>
    this.onNewProjection(MapViewType.ANTARCTIC);

  public onNewProjection(view: MapViewType): void {
    this.store$.dispatch(new mapStore.SetMapView(view));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
