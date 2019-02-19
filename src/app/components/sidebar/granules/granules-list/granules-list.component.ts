import {
  Component, OnInit, Input,
  ViewEncapsulation, Output, EventEmitter
} from '@angular/core';

import { faFileDownload, faPlus } from '@fortawesome/free-solid-svg-icons';

import { Sentinel1Product } from '@models';

@Component({
  selector: 'app-granules-list',
  templateUrl: './granules-list.component.html',
  styleUrls: ['./granules-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GranulesListComponent  {
  @Input() granules: Sentinel1Product[];
  @Input() selected: string;

  @Output() newSelected = new EventEmitter<string>();
  @Output() queueGranule = new EventEmitter<string>();
  @Output() newFocusedGranule = new EventEmitter<Sentinel1Product>();
  @Output() clearFocusedGranule = new EventEmitter<void>();

  public pageSizeOptions = [5, 10, 25];
  public pageSize = this.pageSizeOptions[1];
  public pageIndex = 0;

  public downloadIcon = faFileDownload;
  public queueIcon = faPlus;

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
