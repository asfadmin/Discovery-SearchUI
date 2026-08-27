import {
  Component,
  ViewChild,
  ElementRef,
  OnDestroy,
  inject,
  input,
  effect,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { ClipboardService } from 'ngx-clipboard';
import { of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-copy-to-clipboard',
  templateUrl: './copy-to-clipboard.component.html',
  styleUrls: ['./copy-to-clipboard.component.scss'],
  imports: [MatIcon, MatTooltip, MatMenuTrigger, MatMenu, MatMenuItem],
})
export class CopyToClipboardComponent implements OnDestroy {
  private clipboardService = inject(ClipboardService);
  private notificationService = inject(NotificationService);

  value = input<string>('');
  submenu = input<{ prompt: string; message: string; value: string }[]>([]);
  prompt = input<string>('Copy to clipboard');
  message = input<string>();
  notification = input<string>('Copied');
  toast = input<boolean>(true);
  copyIcon = input<string>('file_copy');

  @ViewChild('copyTooltip', { static: true }) copyTooltip: ElementRef;

  display = '';
  private subs = new SubSink();

  constructor() {
    effect(() => {
      this.display = this.prompt();
    });
  }
  public onCopyIconClicked(e: Event): void {
    this.clipboardService.copyFromContent(this.value());
    if (this.toast()) {
      this.notificationService.info(this.message());
    }

    this.subs.add(
      of((' ' + this.prompt()).slice(1))
        .pipe(
          tap(() => (this.display = this.notification())),
          delay(2200),
        )
        .subscribe((msg) => (this.display = msg)),
    );

    e.stopPropagation();
  }

  public onCopyFromMenu(prompt: string, message: string, value: string) {
    this.clipboardService.copyFromContent(value);
    if (this.toast()) {
      this.notificationService.info(message);
    }

    this.subs.add(
      of((' ' + prompt).slice(1))
        .pipe(
          tap(() => (this.display = this.notification())),
          delay(2200),
        )
        .subscribe((msg) => (this.display = msg)),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
