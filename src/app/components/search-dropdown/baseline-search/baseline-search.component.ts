import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import noUiSlider from 'nouislider';

import { SubSink } from 'subsink';

import * as models from '@models';
import { PropertyService, ScreenSizeService } from '@services';

enum FilterPanel {
  DATE = 'Date',
  BASELINE = 'Baseline'
}

@Component({
  selector: 'app-baseline-search',
  templateUrl: './baseline-search.component.html',
  styleUrls: ['./baseline-search.component.scss']
})
export class BaselineSearchComponent implements OnInit {
  @ViewChild('temporalFilter', { static: true }) temporalFilter: ElementRef;
  @ViewChild('perpendicularFilter', { static: true }) perpendicularFilter: ElementRef;

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  private perpendicularSlider;
  private temporalSlider;

  selectedPanel: FilterPanel | null = null;
  panels = FilterPanel;
  defaultPanelOpenState = true;
  panelIsDisabled = true;
  customCollapsedHeight = '30px';
  customExpandedHeight = '30px';

  private subs = new SubSink();

  constructor(
    private screenSize: ScreenSizeService
  ) { }

  ngOnInit(): void {
    this.perpendicularSlider = noUiSlider.create(this.perpendicularFilter.nativeElement, {
      start: [20, 80],
      behaviour: 'drag',
      connect: true,
      range: {
        'min': 0,
        'max': 100
      }
    });
    this.temporalSlider = noUiSlider.create(this.temporalFilter.nativeElement, {
      start: [20, 80],
      behaviour: 'drag',
      connect: true,
      range: {
        'min': 0,
        'max': 100
      }
    });
  }

  public isSelected(panel: FilterPanel): boolean {
    return this.selectedPanel === panel;
  }

  public selectPanel(panel: FilterPanel): void {
    this.selectedPanel = panel;
  }
}
