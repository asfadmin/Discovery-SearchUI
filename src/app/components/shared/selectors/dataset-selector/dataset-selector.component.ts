import { Component, Input, Output, EventEmitter } from '@angular/core';

import * as models from '@models';


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
    this.selectedChange.emit(dataset);
  }
}
