import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as queueStore from '@store/queue';

import * as models from '@models';
// import { PairService } from '@services';
import { SubSink } from 'subsink';
// import { CMRProduct } from '@models';
// import { getMasterName, getScenes } from '@store/scenes';
// import { getPerpendicularRange, getTemporalRange } from '@store/filters';
import { getSearchType } from '@store/search';

@Component({
  selector: 'app-on-demand-add-menu',
  templateUrl: './on-demand-add-menu.component.html',
  styleUrls: ['./on-demand-add-menu.component.scss']
})
export class OnDemandAddMenuComponent implements OnInit {
  @Input() hyp3ableProducts: models.Hyp3ableProductByJobType;

  @ViewChild('addMenu', {static: true}) addMenu: MatMenu;

  // private scenes: CMRProduct[] = [];
  // private referenceScene: CMRProduct;
  // private referenceSceneIdx: number;
  // private temporalRange;
  // private perpendicularRange;

  public searchType: models.SearchType;
  public searchTypes = models.SearchType;
  // public InSAR = models.hyp3JobTypes.INSAR_GAMMA;
  // public AutoRift = models.hyp3JobTypes.AUTORIFT;

  private subs = new SubSink();

  constructor(private store$: Store<AppState>,
              // private pairService: PairService,
              ) { }

  ngOnInit(): void {

    this.subs.add(
      this.store$.select(getSearchType).subscribe( searchtype => this.searchType = searchtype)
    );

  }

  public queueAllOnDemand(products: models.CMRProduct[][], job_type: models.Hyp3JobType): void {
    const jobs: models.QueuedHyp3Job[] = products.map(product => ({
      granules: product,
      job_type
    }));

    this.store$.dispatch(new queueStore.AddJobs(jobs));
  }

  // public queueClosestPair(job_type: models.Hyp3JobType): void {
  //   const closestProduct = this.pairService.findNearestneighbour(this.referenceScene, this.scenes.filter(scene => this.referenceScene.id !== scene.id), true, true, this.temporalRange, this.perpendicularRange, 3);
  //   // console.log(`reference scene:\t ${JSON.stringify(products[0][0])}`);
  //   for (let prod of closestProduct) {
  //     console.log(prod.name);
  //   }
  //   console.log(closestProduct);
  //   const closestProductList = [];
  //   for (let idx = 0; idx < 3; idx++) {
  //     closestProductList.push([this.referenceScene, closestProduct[idx]]);
  //   }

  //   this.queueAllOnDemand(closestProductList, job_type);
  //   // console.log(`closest scene:\t ${JSON.stringify(closestProduct)}`);
  // }

  // public isPairable(products: models.CMRProduct[][]) {
  //   if (products[0] !== null) {
  //     return false;
  //   }

  //   return products[0].find(product => product.metadata.productType === 'SLC'
  //   && product.metadata.perpendicular !== null
  //   && product.metadata.temporal !== null) !== null;
  // }

  public onOpenHelp(infoUrl) {
    window.open(infoUrl);
  }
}
