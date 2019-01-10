import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Platform, platforms } from '../../models';
@Component({
  selector: 'app-platform-selector',
  templateUrl: './platform-selector.component.html',
  styleUrls: ['./platform-selector.component.css']
})
export class PlatformSelectorComponent {
  @Input() platforms: Platform[] = [];
  @Input() selected = new Set<string>();

  @Output() removeSelected = new EventEmitter<string>();
  @Output() addSelected = new EventEmitter<string>();

  public onClick(platform) {
    const { name } = platform;

    if (this.selected.has(name)) {
      this.removeSelected.emit(name);
    } else {
      this.addSelected.emit(name);
    }
  }
}
