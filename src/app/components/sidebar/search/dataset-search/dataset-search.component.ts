import { Component, Input } from '@angular/core';

import * as models from '@models';
import { PropertyService } from '@services';

@Component({
  selector: 'app-dataset-search',
  templateUrl: './dataset-search.component.html',
  styleUrls: ['./dataset-search.component.scss']
})

export class DatasetSearchComponent {
  @Input() dataset: models.CMRProduct;

  defaultPanelOpenState = true;
  panelIsDisabled = true;
  customCollapsedHeight = '30px';
  customExpandedHeight = '30px';

  public p = models.Props;

  constructor(public prop: PropertyService) {}
}
