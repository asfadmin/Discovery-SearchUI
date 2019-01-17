import { Component, OnInit, Input } from '@angular/core';

import { of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-product-name',
  templateUrl: './product-name.component.html',
  styleUrls: ['./product-name.component.scss']
})
export class ProductNameComponent {
  @Input() name = '';

  constructor(private clipboardService: ClipboardService) {}

  public copyPrompt =  'Copy to clipboard';
  public copyNotification = 'Copied!';

  public copyTooltipMessage = this.copyPrompt;

  public copyIcon = faCopy;
  public isNameHovered = false;

  onNameHover(): void {
    this.isNameHovered = !this.isNameHovered;
  }

  onCopyIconClicked(e: Event): void {
    this.clipboardService.copyFromContent(this.name);

    of(this.copyPrompt).pipe(
      tap(() => this.copyTooltipMessage = this.copyNotification),
      delay(2200)
    ).subscribe(
      msg => this.copyTooltipMessage = msg
    );

    e.stopPropagation();
  }
}
