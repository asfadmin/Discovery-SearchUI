import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Platform } from '@models';


@Component({
  selector: 'app-platform-selector',
  templateUrl: './platform-selector.component.html',
  styleUrls: ['./platform-selector.component.scss']
})
export class PlatformSelectorComponent {
  @Input() platforms: Platform[] = [];
  @Input() selected: string | null;

  @Output() removeSelected = new EventEmitter<string>();
  @Output() addSelected = new EventEmitter<string>();

  public onSelectionChange(platform) {
    this.addSelected.emit(platform);
  }
}
