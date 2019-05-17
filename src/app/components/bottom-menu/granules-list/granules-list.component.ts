import {
  Component, OnInit, Input, ViewChild,
  ViewEncapsulation, Output, EventEmitter
} from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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

  ngOnInit() {
    this.granules$.pipe(
      tap(_ => this.paginator.firstPage())
    ).subscribe(
      granules => this.granules = granules
    );
  }

  public onListKeydown(key): void {
    switch ( key ) {
      case 'ArrowDown': return console.log('next product');
      case 'ArrowUp': return console.log('previous product');
      case 'ArrowRight': return console.log('next page');
      case 'ArrowLeft': return console.log('previous page');
    }
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
    this.pageIndex = page.pageIndex;
    this.pageSize = page.pageSize;
  }
}
