import { Component } from '@angular/core';

import { MapService } from '@services';

@Component({
  selector: 'app-displacement-layers',
  templateUrl: './displacement-layers.component.html',
  styleUrl: './displacement-layers.component.scss'
})
export class DisplacementLayersComponent {
  constructor(
    private mapService: MapService,
  ) { }

  public updatePriority(isChecked: boolean): void {
    if(isChecked) {
      this.mapService.enablePriority();
    }
    else {
      this.mapService.disablePriority();
    }
  }
}
