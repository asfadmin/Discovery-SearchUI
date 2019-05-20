import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-granule-detail',
  templateUrl: './granule-detail.component.html',
  styleUrls: ['./granule-detail.component.css']
})
export class GranuleDetailComponent {
  @Input() granule: models.CMRProduct;

  public onOpenImage(granule): void {
    window.open(granule.browse);
  }
}
