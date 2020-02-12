import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import * as models from '@models';


@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private dataset: models.Dataset;

  constructor(private store$: Store<AppState>) {
    this.store$.select(filtersStore.getSelectedDataset).subscribe(
      p => this.dataset = p
    );
  }

  public isRelevant(prop: models.Props, dataset?: models.Dataset): boolean {
    const currentDataset = dataset || this.dataset;

    return currentDataset.properties.includes(prop);
  }

  public saveProperties(props, paramName: string, keyFunc = v => v) {
      const param = props.map(keyFunc).join(',');

      return { [paramName]: param };
  }

  public loadProperties(loadStr: string, datasetPropertyKey: string, keyFunc = v => v): any[] {
    const [datasetName, possibleValuesStr] = this.hasDatasetId(loadStr) ?
      this.oldFormat(loadStr) :
      this.shortFormat(loadStr);

    const possibleTypes = (possibleValuesStr || '').split(',');

    const dataset = models.datasets
        .filter(d => datasetName === d.id)
        .pop();

    if (!dataset) {
      return;
    }

    const datasetValues = dataset[datasetPropertyKey];

    const validValuesFromUrl =
      datasetValues.filter(
        value => possibleTypes.includes(keyFunc(value))
      );

    return Array.from(validValuesFromUrl);
  }

  private hasDatasetId(loadStr: string): boolean {
    return loadStr.split('$$').length === 2;
  }

  private oldFormat(loadStr: string) {
    return loadStr.split('$$');
  }

  private shortFormat(loadStr: string) {
    return [this.dataset.id, loadStr];
  }
}
