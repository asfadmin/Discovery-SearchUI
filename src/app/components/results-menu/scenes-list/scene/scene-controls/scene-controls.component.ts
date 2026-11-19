import { Component, inject, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

import { Hyp3JobStatusBadgeComponent } from '@components/shared/hyp3-job-status-badge/hyp3-job-status-badge.component';
import { OnDemandAddMenuComponent } from '@components/shared/on-demand-add-menu/on-demand-add-menu.component';
import * as models from '@models';
import * as services from '@services';

@Component({
  selector: 'app-scene-controls',
  templateUrl: './scene-controls.component.html',
  styleUrls: ['./scene-controls.component.scss'],
  imports: [
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

  readonly hyp3ableByJobType = input<{
    total: number;
    byJobType: models.Hyp3ableProductByJobType[];
  }>();
  readonly scene = input<models.CMRProduct>();
  readonly isQueued = input<boolean>();
  readonly numQueued = input<number>();
  readonly searchType = input<models.SearchType>();

  readonly onZoomToScene = output();
  readonly onToggleScene = output();

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
    return this.hyp3.getExpiredHyp3ableObject(this.scene());
  }
}
