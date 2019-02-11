import {
  Component, OnInit, Input,
  ViewEncapsulation, Output, EventEmitter
} from '@angular/core';

import { faFileDownload, faPlus } from '@fortawesome/free-solid-svg-icons';

import { Sentinel1Product } from '@models';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsListComponent  {
  @Input() granules: Sentinel1Product[];
  @Input() selected: string;

  @Output() newSelected = new EventEmitter<string>();
  @Output() queueGranule = new EventEmitter<string>();

  public downloadIcon = faFileDownload;
  public queueIcon = faPlus;

  public onGranuleSelected(name: string): void {
    this.newSelected.emit(name);
  }

  public onQueueGranule(e: Event, groupId: string): void {
    this.queueGranule.emit(groupId);

    e.stopPropagation();
  }
}
