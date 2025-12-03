import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import * as models from '@models';

import { Store } from '@ngrx/store';
import { AppState } from '@store';

import * as queueStore from '@store/queue';
import * as filterStore from '@store/filters';
import * as uiStore from '@store/ui';

import { SubSink } from 'subsink';
import * as services from '@services';
import { NgIf, AsyncPipe } from '@angular/common';
import { SearchTypeSelectorComponent } from '@components/shared/selectors/search-type-selector/search-type-selector.component';
import { SarviewsEventSearchSelectorComponent } from '@components/shared/selectors/sarviews-event-search-selector/sarviews-event-search-selector.component';
import { SarviewsEventTypeSelectorComponent } from '@components/shared/selectors/sarviews-event-type-selector/sarviews-event-type-selector.component';
import { DateSelectorComponent } from '@components/shared/selectors/date-selector/date-selector.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SearchButtonComponent } from '@components/shared/search-button/search-button.component';
import { HeaderButtonsComponent } from '../header-buttons/header-buttons.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sarviews-header',
  templateUrl: './sarviews-header.component.html',
  styleUrls: ['./sarviews-header.component.scss', '../header.component.scss'],
  imports: [
    NgIf,
    SearchTypeSelectorComponent,
    SarviewsEventSearchSelectorComponent,
    SarviewsEventTypeSelectorComponent,
    DateSelectorComponent,
    MatButton,
    MatIcon,
    SearchButtonComponent,
    HeaderButtonsComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class SarviewsHeaderComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(services.ScreenSizeService);

  public datasets = models.datasetList;
  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts);
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  private subs = new SubSink();

  public selectedDataset: string;

  ngOnInit() {
    this.subs.add(
      this.store$
        .select(filterStore.getSelectedDatasetId)
        .subscribe((selected) => (this.selectedDataset = selected)),
    );
  }

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.OpenFiltersMenu());
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }

  public closeAOIOptions(): void {
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }

  public onDatasetChange(dataset: string): void {
    this.store$.dispatch(new filterStore.SetSelectedDataset(dataset));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
