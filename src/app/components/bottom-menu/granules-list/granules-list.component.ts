import {
  Component, OnInit, Input, ViewChild,
  ViewEncapsulation, Output, EventEmitter,
  HostListener
} from '@angular/core';

import { Observable, fromEvent } from 'rxjs';
import { tap, distinctUntilChanged, withLatestFrom, filter, map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as granulesStore from '@store/granules';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';

import { faFileDownload, faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { CMRProduct, SearchType, MapInteractionModeType } from '@models';

@Component({
  selector: 'app-granules-list',
  templateUrl: './granules-list.component.html',
  styleUrls: ['./granules-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GranulesListComponent implements OnInit {
  @Input() granules$: Observable<CMRProduct[]>;
  @Input() selected: string;

  @Output() newSelected = new EventEmitter<string>();
  @Output() queueGranule = new EventEmitter<string>();
  @Output() newFocusedGranule = new EventEmitter<CMRProduct>();
  @Output() clearFocusedGranule = new EventEmitter<void>();

  @ViewChild(CdkVirtualScrollViewport) scroll: CdkVirtualScrollViewport;

  public granules: CMRProduct[];
  public pageSizeOptions = [5, 10];
  public pageSize = this.pageSizeOptions[0];
  public pageIndex = 0;

  public downloadIcon = faFileDownload;
  public queueIcon = faPlus;
  public searchType: SearchType;

  constructor(private store$: Store<AppState>) {}

  ngOnInit() {
    this.store$.select(granulesStore.getSelectedGranule).pipe(
      withLatestFrom(this.granules$),
      filter(([selected, _]) => !!selected),
      map(([selected, granules]) => granules.indexOf(selected)),
    ).subscribe(
      idx => this.scrollTo(idx)
    );

    this.granules$.subscribe(
      granules => this.granules = granules
    );

    this.store$.select(searchStore.getIsLoading).subscribe(
      _ => this.scroll.scrollToOffset(0)
    );

    fromEvent(document, 'keydown').subscribe((e: KeyboardEvent) => {
      const { key } = e;

      switch ( key ) {
        case 'ArrowDown': {
          this.selectNextProduct();
          break;
        }
        case 'ArrowUp': {
          this.selectPreviousProduct();
          break;
        }
        case 'ArrowRight': {
          this.selectNextProduct();
          break;
        }
        case 'ArrowLeft': {
          this.selectPreviousProduct();
          break;
        }
      }
    });

    this.store$.select(uiStore.getSearchType).subscribe(
      searchType => this.searchType = searchType
    );
  }

  private selectNextProduct(): void {
    if (!this.selected) {
      return;
    }

    const currentSelected = this.granules
      .filter(g => g.name === this.selected)
      .pop();

    const nextIdx = Math.min(
      this.granules.indexOf(currentSelected) + 1,
      this.granules.length - 1
    );

    const nextGranule = this.granules[nextIdx];

    this.store$.dispatch(new granulesStore.SetSelectedGranule(nextGranule.id));
  }

  private selectPreviousProduct(): void {
    if (!this.selected) {
      return;
    }

    const currentSelected = this.granules
      .filter(g => g.name === this.selected)
      .pop();

    const previousIdx = Math.max(this.granules.indexOf(currentSelected) - 1, 0);
    const previousGranule = this.granules[previousIdx];

    this.store$.dispatch(new granulesStore.SetSelectedGranule(previousGranule.id));
  }

  private scrollTo(idx: number): void {
    this.scroll.scrollToIndex(idx);
  }

  public onGranuleSelected(name: string): void {
    this.newSelected.emit(name);
  }

  public onQueueGranule(e: Event, groupId: string): void {
    this.queueGranule.emit(groupId);

    e.stopPropagation();
  }

  public onSetFocusedGranule(granule: CMRProduct): void {
    this.newFocusedGranule.emit(granule);
  }

  public onClearFocusedGranule(): void {
    this.clearFocusedGranule.emit();
  }

  public currentPageOf(granules, pageSize, pageIndex): CMRProduct[] {
    const offset = pageIndex * pageSize;
    return granules.slice(offset, offset + pageSize);
  }

  public onNewPage(page): void {
    this.pageIndex = page.pageIndex;
    this.pageSize = page.pageSize;
  }

  public clearResults(): void {
    this.store$.dispatch(new granulesStore.ClearGranules());

    if (this.searchType === SearchType.DATASET) {
      this.store$.dispatch(
        new mapStore.SetMapInteractionMode(MapInteractionModeType.DRAW)
      );
    }
  }
}
