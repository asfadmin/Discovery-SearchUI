import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cart-toggle',
  templateUrl: './cart-toggle.component.html',
  styleUrls: ['./cart-toggle.component.scss'],
  imports: [MatIconButton, MatTooltip, MatIcon, TranslateModule],
})
export class CartToggleComponent {
  @Output() toggle = new EventEmitter<boolean>();
  @Input() isQueued: boolean;

  public onToggle(): void {
    this.toggle.emit(this.isQueued);
  }
}
