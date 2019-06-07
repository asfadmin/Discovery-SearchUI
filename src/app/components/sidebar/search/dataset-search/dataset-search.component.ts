import { Component, Input } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-dataset-search',
  templateUrl: './dataset-search.component.html',
  styleUrls: ['./dataset-search.component.scss']
})

export class DatasetSearchComponent {
  @Input() platform: models.CMRProduct;

  defaultPanelOpenState = true;
  panelIsDisabled = true;
  customCollapsedHeight = '30px';
  customExpandedHeight = '30px';

  public p = models.Props;

  public isRelavent(prop: models.Props): boolean {
    return models.datasetProperties[prop].includes(this.platform.name);
  }
}
