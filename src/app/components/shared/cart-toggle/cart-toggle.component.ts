import { Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cart-toggle',
  templateUrl: './cart-toggle.component.html',
  styleUrls: ['./cart-toggle.component.scss'],
  imports: [MatIconButton, MatTooltip, MatIcon, TranslateModule],
})
export class CartToggleComponent {
  readonly toggle = output<boolean>();
  readonly isQueued = input<boolean>(undefined);

  public onToggle(): void {
    this.toggle.emit(this.isQueued());
  }
}
