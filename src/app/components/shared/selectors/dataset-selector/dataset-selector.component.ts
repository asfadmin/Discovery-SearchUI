import { Component, Input, Output, EventEmitter } from '@angular/core';

import * as models from '@models';

// Declare GTM dataLayer array.
declare global {
  interface Window { dataLayer: any[]; }
}

@Component({
  selector: 'app-dataset-selector',
  templateUrl: './dataset-selector.component.html',
  styleUrls: ['./dataset-selector.component.scss']
})
export class DatasetSelectorComponent {
  @Input() datasets: models.Dataset[];
  @Input() selected: string;
  @Output() selectedChange = new EventEmitter<string>();

  public onSelectionChange(dataset: string): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'dataset-selected',
      'dataset': dataset
    });
    this.selectedChange.emit(dataset);
  }
}
