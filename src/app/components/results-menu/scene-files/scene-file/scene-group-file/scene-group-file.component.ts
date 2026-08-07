import { Component, input, output } from '@angular/core';

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
  ],
})
export class SceneGroupFileComponent {
  product = input.required<models.CMRProduct>();
  isQueued = input(false);
  validHyp3JobTypes = input<models.Hyp3JobType[]>([]);

  toggle = output<void>();
  queueHyp3Job = output<models.QueuedHyp3Job>();

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
}
