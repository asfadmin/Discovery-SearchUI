import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import * as models from '@models';
import { Store } from '@ngrx/store';
import * as queueStore from '@store/queue';
import { AppState } from '@store';
import { PairService } from '@services';
import { CMRProduct } from '@models';
import { getMasterName, getScenes } from '@store/scenes';
import { getTemporalRange } from '@store/filters';
@Component({
  selector: 'app-closest-pair',
  templateUrl: './closest-pair.component.html',
  styleUrls: ['./closest-pair.component.scss']
})
export class ClosestPairComponent implements OnInit {

  public scenes: CMRProduct[] = [];
  public points = 1;
  private referenceScene: CMRProduct;
  private referenceSceneIdx: number;
  private temporalRange;

  public InSAR = models.hyp3JobTypes.INSAR_GAMMA;
  public AutoRift = models.hyp3JobTypes.AUTORIFT;

  private subs = new SubSink();

  constructor(private store$: Store<AppState>,
    private pairService: PairService, ) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(getScenes).subscribe(
        scenes => this.scenes = scenes
      )
    );
    this.subs.add(
      this.store$.select(getMasterName).subscribe(
        refSceneName => {
            this.referenceSceneIdx = this.scenes.findIndex(scene => scene.name === refSceneName);
            this.referenceScene = this.scenes[this.referenceSceneIdx];
        }
      )
    );
    this.subs.add(
      this.store$.select(getTemporalRange).subscribe( range => this.temporalRange = range)
    );
  }

  public queueClosestPair(job_type: models.Hyp3JobType): void {
    const closestProduct = this.pairService.findNearestneighbour(this.referenceScene,
      this.scenes.filter(scene => this.referenceScene.id !== scene.id),
      this.temporalRange,
      this.points
    );

    const closestProductList = [];
    for (let idx = 0; idx < this.points; idx++) {
      closestProductList.push([this.referenceScene, closestProduct[idx]]);
    }

    this.queueAllOnDemand(closestProductList, job_type);
  }

  public queueAllOnDemand(products: models.CMRProduct[][], job_type: models.Hyp3JobType): void {
    const jobs: models.QueuedHyp3Job[] = products.map(product => ({
      granules: product,
      job_type
    }));

    this.store$.dispatch(new queueStore.AddJobs(jobs));
  }

  public updatePairCount(event: Event) {
    const val = (event.target as HTMLInputElement).valueAsNumber;
    this.points = Math.min(val, this.scenes.length - 2);
  }

}
