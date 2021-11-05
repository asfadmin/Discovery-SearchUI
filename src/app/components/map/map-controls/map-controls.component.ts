import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as mapStore from '@store/map';
import * as searchStore from '@store/search';
import * as sceneStore from '@store/scenes';

import * as models from '@models';
import * as services from '@services';

import { LonLat, SarviewsProduct, SearchType } from '@models';
import { combineLatest } from 'rxjs';
import { PinnedProduct } from '@services/browse-map.service';
import { filter, startWith, tap } from 'rxjs/operators';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-map-controls',
  templateUrl: './map-controls.component.html',
  styleUrls: ['./map-controls.component.scss']
})
export class MapControlsComponent implements OnInit, OnDestroy {
  public view$ = this.store$.select(mapStore.getMapView);
  public pinnedProducts$ = this.store$.select(sceneStore.getImageBrowseProducts);

  public selectedScene$ = this.store$.select(sceneStore.getSelectedScene).pipe(
    tap(_ => this.browseIndex = 0),
    filter(scene => !!scene),
  startWith(null));
  public selectedEvent$ = this.store$.select(sceneStore.getSelectedSarviewsProduct).pipe(
    tap(_ => this.browseIndex = 0),
    filter(event => !!event),
  startWith(null));

  public currentBrowseID: string = '';

  public searchType: models.SearchType;
  public searchTypes = models.SearchType;
  public viewTypes = models.MapViewType;
  public mousePos: LonLat;
  private subs = new SubSink();
  private browseIndex = 0;
  private selectedEventProducts: SarviewsProduct[] = [];
  private selectedScene: models.CMRProduct;

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
            }
           } else {
             if(!!scene) {
              this.currentBrowseID = scene.id;
             }
            }
          }
      )
    );

    this.subs.add(
      this.store$.select(sceneStore.getSelectedSarviewsEventProducts)
      .pipe(filter(event => !!event))
      .subscribe(
        event => this.selectedEventProducts = event
      )
    );

    this.subs.add(
      this.store$.select(sceneStore.getSelectedScene)
      .pipe(filter(event => !!event))
      .subscribe(
        event => this.selectedScene = event
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


  public onPinProduct(product_id: string, pinnedProducts: {[product_id in string]: PinnedProduct}) {
    let temp: {[product_id in string]: PinnedProduct} = JSON.parse(JSON.stringify(pinnedProducts));
    if(!!temp[product_id]) {
      delete temp[product_id];
    } else {

      let url: string;
      let wkt: string;

      if(this.searchType === SearchType.SARVIEWS_EVENTS) {
        const targetProduct = this.selectedEventProducts.find(prod => prod.product_id === product_id);
        url = targetProduct?.product_id;
        wkt = targetProduct?.granules[0].wkt;
      } else {
        const targetProduct = this.selectedScene;
        url = targetProduct?.browses[this.browseIndex];
        wkt = targetProduct?.metadata.polygon;
      }

      temp[product_id] = {url, wkt} as PinnedProduct
    }

    // this.pinnedProducts[product_id].isPinned = !this.pinnedProducts[product_id].isPinned;
    this.setPinnedProducts(temp);
  }

  public onIncrementBrowseIndex() {
    const newIndex = this.browseIndex === this.getBrowseCount() - 1 ? 0 : this.browseIndex + 1;
    this.onUpdateBrowseIndex(newIndex)
  }

  public onDecrementBrowseIndex() {
    const newIndex = this.browseIndex === 0 ? this.getBrowseCount() - 1 : this.browseIndex - 1;
    this.onUpdateBrowseIndex(newIndex)
  }

  public onUpdateBrowseIndex(newIndex: number) {
    this.browseIndex = newIndex;
    const [url, wkt] = this.searchType === SearchType.SARVIEWS_EVENTS
    ? [this.selectedEventProducts[this.browseIndex].files.browse_url, this.selectedEventProducts[this.browseIndex].files.browse_url]
    : [this.selectedScene.browses[this.browseIndex], this.selectedScene.metadata.polygon];

    this.mapService.setSelectedBrowse(url, wkt);
  }

  private getBrowseCount() {
    return this.searchType === SearchType.SARVIEWS_EVENTS
    ? this.selectedEventProducts.length : this.selectedScene.browses.length;
  }

  private setPinnedProducts(products: {[product_id in string]: PinnedProduct}) {
    this.store$.dispatch(new sceneStore.SetImageBrowseProducts(products));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
