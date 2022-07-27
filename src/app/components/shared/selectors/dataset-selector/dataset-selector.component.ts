import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';

import * as models from '@models';
import { ScreenSizeService } from '@services';
import { MatMenuTrigger } from '@angular/material/menu';
import { DateRange } from '@models';

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
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public isReadMore = true;

  constructor(
    private screenSize: ScreenSizeService,
  ) {}

  public onSelectionChange(dataset: string): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'dataset-selected',
      'dataset': dataset,
    });
    this.selectedChange.emit(dataset);
  }

  public datasetNameLookup(datasetId: string): string {
    let datasetName = '';
    this.datasets.forEach( (dataset) => {
      if (dataset.id === datasetId) {
        datasetName = dataset.name;
      }
    });
    return datasetName;
  }

  public prettyDateRange(dateRange: DateRange): string {
    const { start, end } = dateRange;

    const startYear = start.getFullYear();
    const endYear = (!end) ? 'Present' : end.getFullYear();

    return startYear === endYear ?
      `${startYear}`.trim() :
      `${startYear} to ${endYear}`.trim();
  }

  public onOpenDocs(event, dataset: string) {
    this.trigger.closeMenu();
    this.onSelectionChange(dataset);
    event.stopPropagation();
  }

}
