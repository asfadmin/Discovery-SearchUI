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
  @Input() prompt = 'Copy to clipboard';
  @Input() notification = 'Copied';

  @ViewChild('copyTooltip', { static: true }) copyTooltip: ElementRef;

  public copyIcon = faCopy;

  constructor(private clipboardService: ClipboardService) { }

  public onCopyIconClicked(e: Event): void {
    this.clipboardService.copyFromContent(this.value);

    of(this.prompt).pipe(
      tap(() => this.prompt = this.notification),
      delay(2200)
    ).subscribe(
      msg => this.prompt = msg
    );

    e.stopPropagation();
  }
}
