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

import { faFileDownload, faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material';

import { Sentinel1Product } from '@models';

@Component({
  selector: 'app-granules-list',
  templateUrl: './granules-list.component.html',
  styleUrls: ['./granules-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GranulesListComponent implements OnInit {
  @Input() granules$: Observable<Sentinel1Product[]>;
  @Input() selected: string;

  @Output() newSelected = new EventEmitter<string>();
  @Output() queueGranule = new EventEmitter<string>();
  @Output() newFocusedGranule = new EventEmitter<Sentinel1Product>();
  @Output() clearFocusedGranule = new EventEmitter<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public granules: Sentinel1Product[];
  public pageSizeOptions = [5, 10];
  public pageSize = this.pageSizeOptions[0];
  public pageIndex = 0;

  public downloadIcon = faFileDownload;
  public queueIcon = faPlus;

  constructor(private store$: Store<AppState>) {}

  ngOnInit() {
    this.store$.select(granulesStore.getSelectedGranule).pipe(
      withLatestFrom(this.granules$),
      filter(([selected, _]) => !!selected),
      map(([selected, granules]) =>
        Math.ceil((granules.indexOf(selected) + 1) / this.pageSize) - 1
      ),
    ).subscribe(
      selectedPageIdx => {
        while (this.paginator.pageIndex !== selectedPageIdx) {
          if (this.paginator.pageIndex > selectedPageIdx) {
            this.paginator.previousPage();
          } else {
            this.paginator.nextPage();
          }
        }
      }
    );

    this.granules$.subscribe(
      granules => this.granules = granules
    );

    this.store$.select(searchStore.getIsLoading).subscribe(
      _ => this.paginator.firstPage()
    );

    fromEvent(document, 'keydown').subscribe((e: KeyboardEvent) => {
      const { key } = e;

      switch ( key ) {
        case 'ArrowDown': return console.log('next product');
        case 'ArrowUp': return console.log('previous product');
        case 'ArrowRight': {
          return this.paginator.nextPage();
        }
        case 'ArrowLeft': {
          return this.paginator.previousPage();
        }
      }
    });
  }

  public onGranuleSelected(name: string): void {
    this.newSelected.emit(name);
  }

  public onQueueGranule(e: Event, groupId: string): void {
    this.queueGranule.emit(groupId);

    e.stopPropagation();
  }

  public onSetFocusedGranule(granule: Sentinel1Product): void {
    this.newFocusedGranule.emit(granule);
  }

  public onClearFocusedGranule(): void {
    this.clearFocusedGranule.emit();
  }

  public currentPageOf(granules, pageSize, pageIndex): Sentinel1Product[] {
    const offset = pageIndex * pageSize;
    return granules.slice(offset, offset + pageSize);
  }

  public onNewPage(page): void {
    console.log('new page', page);
    this.pageIndex = page.pageIndex;
    this.pageSize = page.pageSize;
  }
}
