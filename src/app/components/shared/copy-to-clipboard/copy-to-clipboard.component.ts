import { Component, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { ClipboardService } from 'ngx-clipboard';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-copy-to-clipboard',
  templateUrl: './copy-to-clipboard.component.html',
  styleUrls: ['./copy-to-clipboard.component.css']
})
export class CopyToClipboardComponent implements OnDestroy {
  @Input() value: string;
  @Input() prompt = 'Copy to clipboard';
  @Input() notification = 'Copied';
  @Input() toast = true;

  @ViewChild('copyTooltip', { static: true }) copyTooltip: ElementRef;

  public copyIcon = faCopy;
  private subs = new SubSink();

  constructor(
    private clipboardService: ClipboardService,
    private notificationService: NotificationService
    ) { }

  public onCopyIconClicked(e: Event): void {
    this.clipboardService.copyFromContent(this.value);
    if (this.toast) {
      this.notificationService.clipboardCopyIcon(this.prompt, this.value.split(',').length);
    }

    this.subs.add(
      of((' ' + this.prompt).slice(1)).pipe(
        tap(() => this.prompt = this.notification),
        delay(2200)
      ).subscribe(
        msg => this.prompt = msg
      )
    );

    e.stopPropagation();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
