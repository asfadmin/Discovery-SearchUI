import { Component, OnInit } from '@angular/core';

import { filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as scenesStore from '@store/scenes';

import * as models from '@models';
import { DatasetForProductService, PropertyService } from '@services';


@Component({
  selector: 'app-scene-metadata',
  templateUrl: './scene-metadata.component.html',
  styleUrls: ['./scene-metadata.component.css']
})
export class SceneMetadataComponent implements OnInit {
  public dataset: models.Dataset;

  public p = models.Props;
  public scene: models.CMRProduct;
  public searchType: models.SearchType;

  constructor(
    public prop: PropertyService,
    private store$: Store<AppState>,
    private datasetForProduct: DatasetForProductService
  ) { }

  ngOnInit() {
    const scene$ = this.store$.select(scenesStore.getSelectedScene);

    this.store$.select(uiStore.getSearchType).subscribe(
     searchType => this.searchType = searchType
    );

    scene$.subscribe(
      scene => this.scene = scene
    );

    scene$.pipe(
      filter(g => !!g),
      map(scene => this.datasetForProduct.match(scene)),
    ).subscribe(dataset => this.dataset = dataset);
  }

  public isGeoSearch(): boolean {
    return this.searchType === models.SearchType.DATASET;
  }

  public hasValue(v: any): boolean {
    return v !== null && v !== undefined;
  }
}
