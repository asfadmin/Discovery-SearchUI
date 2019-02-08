import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Sentinel1Product } from '@models';


@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent {
  @Input() products: Sentinel1Product[];

  @Output() itemRemoved = new EventEmitter<Sentinel1Product>();
  @Output() clear = new EventEmitter<void>();

  @Output() makeDownloadScript = new EventEmitter<void>();

  public onRemoveProduct(product: Sentinel1Product): void {
    this.itemRemoved.emit(product);
  }

  public onClearQueue(): void {
    this.clear.emit();
  }

  public onMakeDownloadScript(): void {
    console.log('event')
    this.makeDownloadScript.emit();
  }
}
