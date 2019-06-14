import {
  Component, OnInit, Input, ViewChild, ViewEncapsulation
} from '@angular/core';

import { fromEvent } from 'rxjs';
import { tap, withLatestFrom, filter, map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as granulesStore from '@store/granules';
import * as uiStore from '@store/ui';
import * as queueStore from '@store/queue';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import * as services from '@services';
import * as models from '@models';

@Component({
  selector: 'app-granules-list',
  templateUrl: './granules-list.component.html',
  styleUrls: ['./granules-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GranulesListComponent implements OnInit {
  @Input() dataset: models.Dataset;

  @ViewChild(CdkVirtualScrollViewport, { static: true }) scroll: CdkVirtualScrollViewport;

  public granules$ = this.store$.select(granulesStore.getGranules);
  public granules: models.CMRProduct[];
  public  selected: string;

  public searchType: models.SearchType;
  public selectedFromList = false;
  public p = models.Props;

  constructor(
    private store$: Store<AppState>,
    private mapService: services.MapService,
    private wktService: services.WktService,
    public prop: services.PropertyService,
  ) {}

  ngOnInit() {
    this.store$.select(granulesStore.getSelectedGranule).pipe(
      withLatestFrom(this.granules$),
      filter(([selected, _]) => !!selected),
      tap(([selected, _]) => this.selected = selected.name),
      map(([selected, granules]) => granules.indexOf(selected)),
    ).subscribe(
      idx => {
        if (!this.selectedFromList) {
          this.scrollTo(idx);
        }

        this.selectedFromList = false;
      }
    );

    this.granules$.subscribe(
      granules => this.granules = granules
    );

    this.store$.select(searchStore.getIsLoading).subscribe(
      _ => this.scroll.scrollToOffset(0)
    );

    fromEvent(document, 'keydown').subscribe((e: KeyboardEvent) => {
      const { key } = e;

      switch (key) {
        case 'ArrowRight': {
          return this.selectNextGranule();
        }
        case 'ArrowLeft': {
          return this.selectPreviousGranule();
        }

        case 'ArrowDown': {
          return this.selectNextGranule();
        }
        case 'ArrowUp': {
          return this.selectPreviousGranule();
        }
      }
    });

    this.store$.select(uiStore.getSearchType).subscribe(
      searchType => this.searchType = searchType
    );
  }

  private selectNextGranule(): void {
    this.store$.dispatch(new granulesStore.SelectNextGranule());
  }

  private selectPreviousGranule(): void {
    this.store$.dispatch(new granulesStore.SelectPreviousGranule());
  }

  private scrollTo(idx: number): void {
    this.scroll.scrollToIndex(idx);
  }

  public onGranuleSelected(name: string): void {
    this.selectedFromList = true;
    this.store$.dispatch(new granulesStore.SetSelectedGranule(name));
  }

  public onQueueGranule(e: Event, groupId: string): void {
    this.store$.dispatch(new queueStore.QueueGranule(groupId));

    e.stopPropagation();
  }

  public onSetFocusedGranule(granule: models.CMRProduct): void {
    this.store$.dispatch(new granulesStore.SetFocusedGranule(granule));
  }

  public onClearFocusedGranule(): void {
    this.store$.dispatch(new granulesStore.ClearFocusedGranule());
  }

  public onZoomTo(granule: models.CMRProduct): void {
    const features = this.wktService.wktToFeature(
      granule.metadata.polygon,
      this.mapService.epsg()
    );

    this.mapService.zoomTo(features);
  }
}
