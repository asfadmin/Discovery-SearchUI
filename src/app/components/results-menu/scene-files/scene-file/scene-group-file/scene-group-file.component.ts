import {
  Component,
  input,
  output,
  signal,
  inject,
  computed,
} from '@angular/core';

import * as models from '@models';

import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { CopyToClipboardComponent } from '@components/shared/copy-to-clipboard/copy-to-clipboard.component';
import { DownloadFileButtonComponent } from '@components/shared/download-file-button/download-file-button.component';
import { CartToggleComponent } from '@components/shared/cart-toggle/cart-toggle.component';
import { ReadableSizeFromBytesPipe } from '@pipes/readable-size-from-bytes.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MatNestedTreeNode } from '@angular/material/tree';
import { SceneFileGdalDropdownComponent } from '../../scene-group-files/scene-file-gdal-dropdown/scene-file-gdal-dropdown.component';
import { GdalCustomizeMenuComponent } from '@components/shared/gdal-customize-menu/gdal-customize-menu.component';
import { GdalService } from '@services/gdal/gdal.service';
import { NgTemplateOutlet } from '@angular/common';
import { ScreenSizeService } from '@services';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-scene-group-file',
  templateUrl: './scene-group-file.component.html',
  styleUrls: ['./scene-group-file.component.scss'],
  imports: [
    MatIcon,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatTooltip,
    CopyToClipboardComponent,
    DownloadFileButtonComponent,
    CartToggleComponent,
    ReadableSizeFromBytesPipe,
    TranslateModule,
    SceneFileGdalDropdownComponent,
    MatNestedTreeNode,
    GdalCustomizeMenuComponent,
    NgTemplateOutlet,
  ],
})
export class SceneGroupFileComponent {
  screenSize = inject(ScreenSizeService);
  breakpoint = toSignal(this.screenSize.breakpoint$);
  breakpoints = models.Breakpoints;

  gdalService = inject(GdalService);
  product = input.required<models.CMRProduct>();
  isQueued = input(false);
  validHyp3JobTypes = input<models.Hyp3JobType[]>([]);
  isScienceData = input(false);
  isGdalable = computed(
    () =>
      this.isScienceData() &&
      this.gdalService.getProductDatasets(this.product()).length !== 0 &&
      this.breakpoint() !== this.breakpoints.MOBILE,
  );

  toggle = output<void>();
  queueHyp3Job = output<models.QueuedHyp3Job>();
  expanded = signal<boolean>(false);

  public addJobToProcessingQueue(jobType: models.Hyp3JobType): void {
    this.queueHyp3Job.emit({
      granules: [this.product()],
      job_type: jobType,
    });
  }

  public onOpenHelp(e: Event, infoUrl: string) {
    e.stopPropagation();
    window.open(infoUrl);
  }

  public toggleExpanded() {
    this.expanded.set(!this.expanded());
  }
}
