import { Component, Input } from '@angular/core';

import { Platform, platforms } from '../../models';
@Component({
  selector: 'app-platform-selector',
  templateUrl: './platform-selector.component.html',
  styleUrls: ['./platform-selector.component.css']
})
export class PlatformSelectorComponent {
  @Input() platforms: Platform[] = [];
}
