import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-copy-to-clipboard',
  templateUrl: './copy-to-clipboard.component.html',
  styleUrls: ['./copy-to-clipboard.component.css']
})
export class CopyToClipboardComponent {
  @Input() value: string;

  @ViewChild('copyTooltip') copyTooltip: ElementRef;

  public copyIcon = faCopy;
  public copyPrompt =  'Copy to clipboard';
  public copyNotification = 'Copied!';

  public copyTooltipMessage = this.copyPrompt;

  constructor(private clipboardService: ClipboardService) { }

  onCopyIconClicked(e: Event): void {
    this.clipboardService.copyFromContent(this.value);

    of(this.copyPrompt).pipe(
      tap(() => this.copyTooltipMessage = this.copyNotification),
      delay(2200)
    ).subscribe(
      msg => this.copyTooltipMessage = msg
    );

    e.stopPropagation();
  }
}
