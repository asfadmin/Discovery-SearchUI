import { Component } from '@angular/core';

import * as models from '@models';
import { ScreenSizeService } from '@services';

enum FilterPanel {
  MASTER = 'Master',
  DATE = 'Date',
  BASELINE = 'Baseline'
}

@Component({
  selector: 'app-baseline-search',
  templateUrl: './baseline-search.component.html',
  styleUrls: ['./baseline-search.component.scss']
})
export class BaselineSearchComponent {
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  selectedPanel: FilterPanel | null = null;
  panels = FilterPanel;
  defaultPanelOpenState = true;
  panelIsDisabled = true;
  customCollapsedHeight = '30px';
  customExpandedHeight = '30px';

  constructor(
    private screenSize: ScreenSizeService
  ) { }

  public isSelected(panel: FilterPanel): boolean {
    return this.selectedPanel === panel;
  }

  public selectPanel(panel: FilterPanel): void {
    this.selectedPanel = panel;
  }
}
