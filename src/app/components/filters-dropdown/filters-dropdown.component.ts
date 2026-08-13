import { Component, Input, OnInit, inject, Signal } from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';
import * as filterStore from '@store/filters';

import {
  EnvironmentService,
  NotificationService,
  ScreenSizeService,
} from '@services';
import * as models from '@models';
import { Observable } from 'rxjs';
import { areFiltersChanged } from '@store/filters';
import { SBASOverlap } from '@models';
import { AsyncPipe } from '@angular/common';
import { DocsModalComponent } from '@components/shared/docs-modal/docs-modal.component';
import { FrameOrderFiltersComponent } from './frame-order-filters/frame-order-filters.component';
import { DatasetFiltersComponent } from './dataset-filters/dataset-filters.component';
import { ListFiltersComponent } from './list-filters/list-filters.component';
import { BaselineFiltersComponent } from './baseline-filters/baseline-filters.component';
import { SbasFiltersComponent } from './sbas-filters/sbas-filters.component';
import { CustomProductsFiltersComponent } from './custom-products-filters/custom-products-filters.component';
import { TimeseriesFiltersComponent } from './timeseries-filters/timeseries-filters.component';
import { MaxResultsSelectorComponent } from '@components/shared/max-results-selector/max-results-selector.component';
import { CancelFilterChangesComponent } from '@components/shared/cancel-filter-changes/cancel-filter-changes.component';
import { SearchButtonComponent } from '@components/shared/search-button/search-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-filters-dropdown',
  templateUrl: './filters-dropdown.component.html',
  styleUrls: ['./filters-dropdown.component.scss'],
  animations: [
    trigger('isOpen', [
      state('true', style({ transform: 'translateY(0%)' })),
      state('false', style({ transform: 'translateY(-10000%)' })),
      transition('true => false', animate('50ms ease-out')),
      transition('false => true', animate('50ms ease-in')),
    ]),
  ],
  imports: [
    DocsModalComponent,
    FrameOrderFiltersComponent,
    DatasetFiltersComponent,
    ListFiltersComponent,
    BaselineFiltersComponent,
    SbasFiltersComponent,
    CustomProductsFiltersComponent,
    TimeseriesFiltersComponent,
    MaxResultsSelectorComponent,
    CancelFilterChangesComponent,
    SearchButtonComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class FiltersDropdownComponent implements OnInit {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);
  private notificationService = inject(NotificationService);
  private environmentService = inject(EnvironmentService);

  @Input() dataset$: Observable<models.CMRProduct>;
  public isFiltersMenuOpen$ = this.store$.select(uiStore.getIsFiltersMenuOpen);

  public searchType: Signal<models.SearchType> = this.store$.selectSignal(
    searchStore.getSearchType,
  );
  public searchTypes = models.SearchType;

  public breakpoint: Signal<models.Breakpoints> = toSignal(
    this.screenSize.breakpoint$,
  );
  public breakpoints = models.Breakpoints;

  private areFiltersChanged: Signal<boolean> =
    this.store$.selectSignal(areFiltersChanged);

  public frameSelectionEnabled$ = this.store$.select(
    uiStore.getIsFrameSelectionEnabled,
  );

  ngOnInit() {
    if (this.environmentService.maturity === 'prod') {
      this.store$.dispatch(
        new filterStore.SetSBASOverlapThreshold(SBASOverlap.ALL),
      );
    }
  }

  public closePanel(): void {
    if (
      this.searchType() !== this.searchTypes.SBAS &&
      this.searchType() !== this.searchTypes.BASELINE &&
      this.areFiltersChanged()
    ) {
      this.notificationService.closeFiltersPanel();
    }
    this.store$.dispatch(new uiStore.CloseFiltersMenu());
  }

  public onSetSearchType(searchType: models.SearchType): void {
    this.store$.dispatch(new searchStore.SetSearchType(searchType));
  }
}
