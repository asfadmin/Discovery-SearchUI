import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as mapStore from '@store/map';
import * as searchStore from '@store/search';
import * as sceneStore from '@store/scenes';

import * as models from '@models';
import * as services from '@services';

import { LonLat, SearchType } from '@models';
import { combineLatest } from 'rxjs';
import { PinnedProduct } from '@services/browse-map.service';
import { debounceTime, filter, first } from 'rxjs/operators';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-map-controls',
  templateUrl: './map-controls.component.html',
  styleUrls: ['./map-controls.component.scss']
})
export class MapControlsComponent implements OnInit, OnDestroy {
  public view$ = this.store$.select(mapStore.getMapView);

  public selectedScene$ = this.store$.select(sceneStore.getSelectedScene);
  public selectedEvent$ = this.store$.select(sceneStore.getSelectedSarviewsProduct);

  public currentBrowseID: string = '';

  public searchType: models.SearchType;
  public searchTypes = models.SearchType;
  public viewTypes = models.MapViewType;
  public mousePos: LonLat;
  private subs = new SubSink();
  private pinnedProducts: {[product_id in string]: PinnedProduct} = {};

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

    this.subs.add(
      combineLatest([this.selectedScene$, this.selectedEvent$]).subscribe(
        ([scene, event]) => {
          if(this.searchType === SearchType.SARVIEWS_EVENTS) {
            if(!!event) {
              this.currentBrowseID = event.product_id;
            } else {
              this.currentBrowseID = scene.id;
            }
          }
        }
      )
    )

    this.subs.add(
      this.store$.select(sceneStore.getAllProducts).pipe(
        debounceTime(2000),
        first(),
        filter(_ => this.searchType !== models.SearchType.SARVIEWS_EVENTS),
      ).subscribe(
        products => {
          if (!!products) {
            this.pinnedProducts = {};
            products.forEach(prod => this.pinnedProducts[prod.id] = {
              isPinned: false,
              url: prod.browses[0],
              wkt: prod.metadata.polygon,
            });

            this.store$.dispatch(new sceneStore.SetImageBrowseProducts(this.pinnedProducts));
          }
        }
      )
    );
  }

  public onNewProjection(view: models.MapViewType): void {
    this.store$.dispatch(new mapStore.SetMapView(view));
  }

  public zoomIn(): void {
    this.mapService.zoomIn();
  }

  public zoomOut(): void {
    this.mapService.zoomOut();
  }

  public onSetOpacity(event: MatSliderChange) {
    this.mapService.updateBrowseOpacity(event.value);
  }


  public onPinProduct(product_id: string) {
    this.pinnedProducts[product_id].isPinned = !this.pinnedProducts[product_id].isPinned;
    this.setPinnedProducts();
  }

  private setPinnedProducts() {
    this.store$.dispatch(new sceneStore.SetImageBrowseProducts(this.pinnedProducts));
    this.mapService.setPinnedProducts(this.pinnedProducts);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
