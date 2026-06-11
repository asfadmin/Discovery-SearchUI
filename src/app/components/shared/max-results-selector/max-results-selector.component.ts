import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as filtersStore from '@store/filters';
import * as scenesStore from '@store/scenes';

import * as models from '@models';
import { SubSink } from 'subsink';
import { PairService, ScenesService } from '@services';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { DocsModalComponent } from '../docs-modal/docs-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { fas, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Pipe, PipeTransform } from '@angular/core';
import { combineLatest } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Pipe({
  name: 'formatNumber',
  standalone: true,
})
export class FormatNumberPipe implements PipeTransform {
  transform(num: number | string): string {
    const n = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(n)) {
      return '';
    }
    return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}

@Component({
  selector: 'app-max-results-selector',
  templateUrl: './max-results-selector.component.html',
  styleUrls: ['./max-results-selector.component.scss'],
  imports: [
    MatMenuTrigger,
    MatIcon,
    FontAwesomeModule,
    MatMenu,
    MatProgressSpinner,
    FormatNumberPipe,
    MatMenuItem,
    DocsModalComponent,
    TranslateModule,
    FontAwesomeModule,
  ],
})
export class MaxResultsSelectorComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private pairService = inject(PairService);
  private sceneService = inject(ScenesService);

  public maxResults: number;
  public isMaxResultsLoading: boolean;
  public areResultsLoaded = false;

  public searchType: models.SearchType;
  public searchTypes = models.SearchType;

  public isDataset = false;
  public totalResultsCount = 0;
  public burstXMLFileCount = 0;

  public possibleMaxResults = [250, 500, 1000, 2000];
  private subs = new SubSink();

  constructor() {
    const library = inject(FaIconLibrary);
    library.addIconPacks(fas);
    library.addIcons(faSpinner);
  }

  ngOnInit() {
    this.subs.add(
      this.store$
        .select(filtersStore.getMaxSearchResults)
        .subscribe((maxResults) => (this.maxResults = maxResults)),
    );
    this.subs.add(
      this.store$
        .select(scenesStore.getAreResultsLoaded)
        .subscribe((areLoaded) => (this.areResultsLoaded = areLoaded)),
    );
    this.subs.add(
      this.store$
        .select(searchStore.getIsMaxResultsLoading)
        .subscribe((isLoading) => (this.isMaxResultsLoading = isLoading)),
    );

    this.subs.add(
      combineLatest([
        this.store$.select(searchStore.getSearchType),
        this.store$.select(searchStore.getSearchAmount),
        this.sceneService.scenes$,
        this.pairService.productsFromPairs$,
      ]).subscribe(([searchType, amount, scenes, sbasProducts]) => {
        this.searchType = searchType;
        this.isDataset = searchType === this.searchTypes.DATASET;

        const currentSearchAmount = Number.isNaN(amount) ? 0 : amount;

        this.burstXMLFileCount = scenes.filter(
          (p) => p.metadata.productType === 'BURST',
        ).length;

        switch (searchType) {
          case this.searchTypes.SBAS:
            this.totalResultsCount = sbasProducts?.length ?? 0;
            break;
          case this.searchTypes.CUSTOM_PRODUCTS:
            this.totalResultsCount = scenes.length;
            break;
          case this.searchTypes.DATASET:
            this.totalResultsCount =
              currentSearchAmount + this.burstXMLFileCount;
            break;
          default:
            this.totalResultsCount = currentSearchAmount;
        }
      }),
    );
  }

  public onNewMaxResults(maxResults: number): void {
    this.store$.dispatch(new filtersStore.SetMaxResults(maxResults));

    if (this.areResultsLoaded) {
      this.store$.dispatch(new searchStore.MakeSearch());
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
