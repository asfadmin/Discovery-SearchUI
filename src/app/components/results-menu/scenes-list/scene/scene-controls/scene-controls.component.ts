import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as services from '@services';
import * as models from '@models';

@Component({
  selector: 'app-scene-controls',
  templateUrl: './scene-controls.component.html',
  styleUrls: ['./scene-controls.component.scss']
})
export class SceneControlsComponent implements OnInit {
  @Input() hyp3ableByJobType: { total: number, byJobType: models.Hyp3ableProductByJobType[]};
  @Input() scene: models.CMRProduct;
  @Input() isQueued: boolean;
  @Input() numQueued: number;
  @Input() searchType: models.SearchType;

  @Output() onZoomToScene = new EventEmitter();
  @Output() onToggleScene = new EventEmitter();

  public SearchTypes = models.SearchType;

  constructor(
    private hyp3: services.Hyp3Service,
  ) { }

  ngOnInit(): void {
  }

  public onZoomTo(): void {
    this.onZoomToScene.emit();
  }

  public onToggle(): void {
    this.onToggleScene.emit();
  }

  public isExpired(job: models.Hyp3Job): boolean {
    return this.hyp3.isExpired(job);
  }

  public isDownloadable(product: models.CMRProduct): boolean {
    return this.hyp3.isDownloadable(product);
  }

  public getExpiredHyp3ableObject(): {byJobType: models.Hyp3ableProductByJobType[], total: number} {
    return this.hyp3.getExpiredHyp3ableObject(this.scene);
  }
}
