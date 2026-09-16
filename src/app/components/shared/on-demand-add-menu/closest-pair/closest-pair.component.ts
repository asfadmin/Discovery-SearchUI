import { Component, OnInit, inject } from '@angular/core';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatMenuItem } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SubSink } from 'subsink';

import * as models from '@models';
import { CMRProduct } from '@models';
import { PairService } from '@services';
import { AppState } from '@store';
import { getTemporalRange } from '@store/filters';
import * as queueStore from '@store/queue';
import { getMasterName, getScenes } from '@store/scenes';

@Component({
  selector: 'app-closest-pair',
  templateUrl: './closest-pair.component.html',
  styleUrls: ['./closest-pair.component.scss'],
  imports: [MatFormField, MatLabel, MatInput, MatMenuItem, TranslateModule],
})
export class ClosestPairComponent implements OnInit {
  private store$ = inject<Store<AppState>>(Store);
  private pairService = inject(PairService);

  public scenes = this.store$.selectSignal(getScenes);
  public points = 1;
  private referenceScene: CMRProduct;
  private referenceSceneIdx: number;
  private temporalRange = this.store$.selectSignal(getTemporalRange);

  public InSAR = models.hyp3JobTypes.INSAR_GAMMA;
  public AutoRift = models.hyp3JobTypes.AUTORIFT;

  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(getMasterName).subscribe((refSceneName) => {
        this.referenceSceneIdx = this.scenes().findIndex(
          (scene) => scene.name === refSceneName,
        );
        this.referenceScene = this.scenes()[this.referenceSceneIdx];
      }),
    );
  }

  public queueClosestPair(job_type: models.Hyp3JobType): void {
    const closestProduct = this.pairService.findNearestneighbour(
      this.referenceScene,
      this.scenes().filter((scene) => this.referenceScene.id !== scene.id),
      this.temporalRange(),
      this.points,
    );

    const closestProductList = [];
    for (let idx = 0; idx < this.points; idx++) {
      closestProductList.push([this.referenceScene, closestProduct[idx]]);
    }

    this.queueAllOnDemand(closestProductList, job_type);
  }

  public queueAllOnDemand(
    products: models.CMRProduct[][],
    job_type: models.Hyp3JobType,
  ): void {
    const jobs: models.QueuedHyp3Job[] = products.map((product) => ({
      granules: product,
      job_type,
    }));

    this.store$.dispatch(new queueStore.AddJobs(jobs));
  }

  public updatePairCount(event: Event) {
    const val = (event.target as HTMLInputElement).valueAsNumber;
    this.points = Math.min(val, this.scenes().length - 2);
  }
}
