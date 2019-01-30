import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hide-icon',
  templateUrl: './hide-icon.component.html',
  styleUrls: ['./hide-icon.component.scss']
})
export class HideIconComponent {
  @Output() hide = new EventEmitter<void>();

  public onHide(e: Event): void {
    e.stopPropagation();
    this.hide.emit();
  }
}
