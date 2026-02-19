import { Component, Input, Output, EventEmitter, inject } from '@angular/core';

import * as models from '@models';
import { ScreenSizeService } from '@services';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { AsyncPipe } from '@angular/common';
import { MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { DatasetComponent } from './dataset/dataset.component';

// Declare GTM dataLayer array.
declare global {
  interface Window {
    dataLayer: any[];
  }
}

@Component({
  selector: 'app-dataset-selector',
  templateUrl: './dataset-selector.component.html',
  styleUrls: ['./dataset-selector.component.scss'],
  imports: [
    MatLabel,
    MatButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    AsyncPipe,
    TranslateModule,
    DatasetComponent,
  ],
})
export class DatasetSelectorComponent {
  private screenSize = inject(ScreenSizeService);

  @Input() datasets: models.Dataset[];
  @Input() selected: string;
  @Output() selectedChange = new EventEmitter<string>();

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public isReadMore = true;

  public onSelectionChange(dataset: string): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'dataset-selected',
      dataset: dataset,
    });
    this.selectedChange.emit(dataset);
  }

  public datasetNameLookup(datasetId: string): string {
    let datasetName = '';
    this.datasets.forEach((dataset) => {
      if (dataset.id === datasetId) {
        datasetName = dataset.name;
      }
    });
    return datasetName;
  }
}
