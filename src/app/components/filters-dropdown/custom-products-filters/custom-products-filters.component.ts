import { Component, inject, Signal } from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { DateSelectorComponent } from '@components/shared/selectors/date-selector/date-selector.component';
import { JobProductNameSelectorComponent } from '@components/shared/selectors/job-product-name-selector/job-product-name-selector.component';
import { JobStatusSelectorComponent } from '@components/shared/selectors/job-status-selector/job-status-selector.component';
import { OnDemandUserSelectorComponent } from '@components/shared/selectors/on-demand-user-selector/on-demand-user-selector.component';
import { ProjectNameSelectorComponent } from '@components/shared/selectors/project-name-selector/project-name-selector.component';
import { SearchTypeSelectorComponent } from '@components/shared/selectors/search-type-selector/search-type-selector.component';
import * as models from '@models';
import { ScreenSizeService } from '@services';
import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';

import { JobIdSelectorComponent } from './job-id-selector/job-id-selector.component';

enum FilterPanel {
  SEARCH = 'SEARCH_OPTIONS',
  PROJECT_NAME = 'Project Name',
  DATE_FILTER = 'Date Filter',
}

@Component({
  selector: 'app-custom-products-filters',
  templateUrl: './custom-products-filters.component.html',
  styleUrls: ['./custom-products-filters.component.scss'],
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    SearchTypeSelectorComponent,
    OnDemandUserSelectorComponent,
    JobIdSelectorComponent,
    DateSelectorComponent,
    ProjectNameSelectorComponent,
    JobStatusSelectorComponent,
    JobProductNameSelectorComponent,
    TranslateModule,
  ],
})
export class CustomProductsFiltersComponent {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  selectedPanel: FilterPanel | null = null;
  panels = FilterPanel;
  defaultPanelOpenState = true;
  panelIsDisabled = true;
  customCollapsedHeight = '30px';
  customExpandedHeight = '30px';
  hyp3JobIds: Signal<string[]> = this.store$.selectSignal(
    hyp3Store.getHyp3JobIds,
  );

  public isSelected(panel: FilterPanel): boolean {
    return this.selectedPanel === panel;
  }

  public selectPanel(panel: FilterPanel): void {
    this.selectedPanel = panel;
  }

  public onNewHyp3JobIds(jobIds: string[]) {
    this.store$.dispatch(new hyp3Store.SetHyp3JobIDs(jobIds));
  }
}
