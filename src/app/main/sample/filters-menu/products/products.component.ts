import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { faFileDownload } from '@fortawesome/free-solid-svg-icons';

import { SentinelGranule } from '../../models';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsComponent implements OnInit {
  @Input() products: SentinelGranule[];

  public downloadIcon = faFileDownload;

  constructor() { }

  ngOnInit(): void {
  }

  public getReadableSize(size: number): string {
    const bytes = size;
    const decimals = 2;

    if (bytes === 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const dm = decimals || 2;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const numUnits = String((bytes / Math.pow(k, i)).toFixed(dm));
    const unit = sizes[i];

    return `${numUnits} ${unit}`;
  }
}
