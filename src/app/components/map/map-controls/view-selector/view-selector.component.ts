import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SubSink } from 'subsink';

import { MapViewType, SearchType } from '@models';
import { AppState } from '@store';
import * as mapStore from '@store/map';
import * as searchStore from '@store/search';

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
  imports: [MatIcon, TranslateModule, MatTooltip, MatButtonToggleModule],
})
export class ViewSelectorComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);

  public view: MapViewType;
  public types = MapViewType;
  public isDisplacementSearch = false;
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

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe((searchType) => {
        this.isDisplacementSearch = searchType === SearchType.DISPLACEMENT;

        // Auto-switch to equatorial view if switching to Displacement Search from a polar view
        if (
          this.isDisplacementSearch &&
          (this.view === MapViewType.ARCTIC ||
            this.view === MapViewType.ANTARCTIC)
        ) {
          this.store$.dispatch(new mapStore.SetMapView(MapViewType.EQUATORIAL));
        }
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
