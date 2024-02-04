import { Injectable } from '@angular/core';

import * as models from '@models';

@Injectable({
  providedIn: 'root'
})
export class DatasetForProductService {

  constructor() { }

  public match(scene: models.CMRProduct) : models.Dataset {
    if (scene.dataset === 'ALOS') {
      return scene.metadata.instrument === 'AVNIR-2' ?
        models.avnir : models.alos;
    }
    if(scene.metadata.productType === 'BURST') {
      return models.sentinel_1_bursts;
    }

    const exact = (datasetID, sceneDataset) => (
      datasetID === sceneDataset
    );

    const partial = (datasetID, sceneDataset) => (
      datasetID.includes(sceneDataset) ||
      sceneDataset.includes(datasetID)
    );

    return (
      this.getDatasetMatching(scene, exact) ||
      this.getDatasetMatching(scene, partial) ||
      models.datasets[0]
    );
  }

  private getDatasetMatching(
    scene: models.CMRProduct,
    comparator: (datasetName: string, sceneDataset: string) => boolean
  ): models.Dataset {
    return  models.datasetList
      .filter(dataset => {
        const [datasetName, sceneDataset] = [
          dataset.id.toLowerCase(),
          scene.dataset.toLocaleLowerCase()
        ];

        return comparator(datasetName, sceneDataset);
      })[0];
  }
}
