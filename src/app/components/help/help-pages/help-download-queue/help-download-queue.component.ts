import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-help-download-queue',
  templateUrl: './help-download-queue.component.html',
  styleUrls: ['./help-download-queue.component.scss'],
  imports: [MatIcon, TranslateModule],
})
export class HelpDownloadQueueComponent {}
