import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy,
  inject,
} from '@angular/core';
import { SubSink } from 'subsink';

import { of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { ClipboardService } from 'ngx-clipboard';
import { NotificationService } from '@services/notification.service';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-copy-to-clipboard',
  templateUrl: './copy-to-clipboard.component.html',
  styleUrls: ['./copy-to-clipboard.component.css'],
  imports: [MatIcon, MatTooltip, MatMenuTrigger, MatMenu, MatMenuItem],
})
export class CopyToClipboardComponent implements OnDestroy {
  private clipboardService = inject(ClipboardService);
  private notificationService = inject(NotificationService);

  @Input() value: string;
  @Input({ required: false }) submenu: [string, string][] = [];
  @Input() prompt = 'Copy to clipboard';
  @Input() notification = 'Copied';
  @Input() toast = true;
  @Input({ required: false }) copyIcon = 'file_copy';
  @ViewChild('copyTooltip', { static: true }) copyTooltip: ElementRef;

  private subs = new SubSink();

  public onCopyIconClicked(e: Event): void {
    this.clipboardService.copyFromContent(this.value);
    if (this.toast) {
      this.notificationService.clipboardCopyIcon(
        this.prompt,
        this.value.split(',').length,
      );
    }

    this.subs.add(
      of((' ' + this.prompt).slice(1))
        .pipe(
          tap(() => (this.prompt = this.notification)),
          delay(2200),
        )
        .subscribe((msg) => (this.prompt = msg)),
    );

    e.stopPropagation();
  }

  public onCopyFromMenu(prompt: string, value: string) {
    this.clipboardService.copyFromContent(value);
    if (this.toast) {
      this.notificationService.linkCopyIcon(prompt, value.split(',').length);
    }

    this.subs.add(
      of((' ' + prompt).slice(1))
        .pipe(
          tap(() => (prompt = this.notification)),
          delay(2200),
        )
        .subscribe((msg) => (prompt = msg)),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
