import { Component } from '@angular/core';

import { Platform } from '../../models';
@Component({
  selector: 'app-platform-selector',
  templateUrl: './platform-selector.component.html',
  styleUrls: ['./platform-selector.component.css']
})
export class PlatformSelectorComponent {
  public platforms: Platform[] = [{
    name: 'Sentinel-1A',
    date: {
      start: new Date(2014, 3, 25)
    }
  }, {
    name: 'Sentinel-1B',
    date: {
      start: new Date(2016, 3, 3)
    }
  }];
}
