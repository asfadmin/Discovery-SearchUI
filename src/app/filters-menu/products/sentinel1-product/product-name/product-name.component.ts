import { Component, OnInit, Input } from '@angular/core';

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

  public copyIcon = faCopy;
  public isNameHovered = false;

  onNameHover(): void {
    this.isNameHovered = !this.isNameHovered;
  }

  onCopyIconClicked(e: Event): void {
    this.clipboardService.copyFromContent(this.name);

    e.stopPropagation();
  }
}
