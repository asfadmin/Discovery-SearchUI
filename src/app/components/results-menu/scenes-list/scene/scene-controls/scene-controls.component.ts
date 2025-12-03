import { Component, Input, Output, EventEmitter, inject } from '@angular/core';

import * as services from '@services';
import * as models from '@models';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenuTrigger } from '@angular/material/menu';
import { Hyp3JobStatusBadgeComponent } from '@components/shared/hyp3-job-status-badge/hyp3-job-status-badge.component';
import { OnDemandAddMenuComponent } from '@components/shared/on-demand-add-menu/on-demand-add-menu.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-scene-controls',
  templateUrl: './scene-controls.component.html',
  styleUrls: ['./scene-controls.component.scss'],
  imports: [
    NgIf,
    MatIcon,
    MatTooltip,
    MatMenuTrigger,
    Hyp3JobStatusBadgeComponent,
    OnDemandAddMenuComponent,
    TranslateModule,
  ],
})
export class SceneControlsComponent {
  private hyp3 = inject(services.Hyp3ApiService);
  private hyp3JobStatus = inject(services.Hyp3JobStatusService);

  @Input() hyp3ableByJobType: {
    total: number;
    byJobType: models.Hyp3ableProductByJobType[];
  };
  @Input() scene: models.CMRProduct;
  @Input() isQueued: boolean;
  @Input() numQueued: number;
  @Input() searchType: models.SearchType;

  @Output() onZoomToScene = new EventEmitter();
  @Output() onToggleScene = new EventEmitter();

  public SearchTypes = models.SearchType;

  public onZoomTo(): void {
    this.onZoomToScene.emit();
  }

  public onToggle(): void {
    this.onToggleScene.emit();
  }

  public isExpired(job: models.Hyp3Job): boolean {
    return this.hyp3JobStatus.isExpired(job);
  }

  public isDownloadable(product: models.CMRProduct): boolean {
    return this.hyp3JobStatus.isDownloadable(product.metadata.job);
  }

  public getExpiredHyp3ableObject(): {
    byJobType: models.Hyp3ableProductByJobType[];
    total: number;
  } {
    return this.hyp3.getExpiredHyp3ableObject(this.scene);
  }
}
