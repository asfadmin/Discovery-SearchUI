import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as mapStore from '@store/map';

import { MapViewType } from '@models';

// Declare GTM dataLayer array.
declare global {
  interface Window { dataLayer: any[]; }
}

@Component({
  selector: 'app-view-selector',
  templateUrl: './view-selector.component.html',
  styleUrls: ['./view-selector.component.scss']
})
export class ViewSelectorComponent implements OnInit, OnDestroy {
  public overviewMapVisible$ = this.store$.select(mapStore.getIsOverviewMapOpen);
  public overviewMapVisible = false;
  public view: MapViewType;
  public types = MapViewType;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
  ) {}

  ngOnInit() {
    this.subs.add(
      this.store$.select(mapStore.getMapView).subscribe(
        view => {
          this.view = view;
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'map-view',
            'map-view': this.view
          });
        }
      )
    );

    this.subs.add(
      this.overviewMapVisible$.subscribe(
        isOpen => this.overviewMapVisible = isOpen
      )
    )
  }

  public onArcticSelected =
    () => this.onNewProjection(MapViewType.ARCTIC)

  public onEquitorialSelected =
    () => this.onNewProjection(MapViewType.EQUITORIAL)

  public onAntarcticSelected =
    () => this.onNewProjection(MapViewType.ANTARCTIC)

  public onNewProjection(view: MapViewType): void {
    this.store$.dispatch(new mapStore.SetMapView(view));
  }

  public onToggleOverviewMap(isOpen: boolean): void {
    this.store$.dispatch(new mapStore.ToggleOverviewMap(!isOpen));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
