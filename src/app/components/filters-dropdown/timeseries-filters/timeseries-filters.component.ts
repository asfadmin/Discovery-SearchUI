import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';

import { SearchTypeSelectorComponent } from '@components/shared/selectors/search-type-selector/search-type-selector.component';
import * as models from '@models';
import { ScreenSizeService } from '@services';

enum FilterPanel {
  SEARCH = 'Search Options',
  MASTER = 'Scene',
  FILTER1 = 'Spatial Filter',
  FILTER2 = 'Temporal Filter',
  DATE = 'Date',
  SEASON = 'Season',
  OVERLAP = 'Overlap',
}
@Component({
  selector: 'app-timeseries-filters',
  templateUrl: './timeseries-filters.component.html',
  styleUrl: './timeseries-filters.component.scss',
  imports: [
    MatAccordion,

    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    SearchTypeSelectorComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class TimeseriesFiltersComponent {
  private screenSize = inject(ScreenSizeService);

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  selectedPanel: FilterPanel | null = null;
  panels = FilterPanel;
  defaultPanelOpenState = true;
  panelIsDisabled = true;
  customCollapsedHeight = '30px';
  customExpandedHeight = '30px';

  public isSelected(panel: FilterPanel): boolean {
    return this.selectedPanel === panel;
  }

  public selectPanel(panel: FilterPanel): void {
    this.selectedPanel = panel;
  }

  public onOpenHelp(url: string): void {
    window.open(url);
  }
}
