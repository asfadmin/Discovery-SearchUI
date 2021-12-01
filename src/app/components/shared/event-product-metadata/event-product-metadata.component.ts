import { Component, Input, OnInit } from '@angular/core';
import * as models from '@models';

interface eventProductMetadata {
  path: number;
  frame: number;
  scene_name: string;
  beamMode: string;
  polarization: string;
  absolute_orbit: number;
  acquisition_date: Date;
}

enum Polarizations {
   'SH' = 'HH',
   'SV' = 'VV',
   'DH' = 'HH+HV',
   'DV' = 'VV+VH'
}

@Component({
  selector: 'app-event-product-metadata',
  templateUrl: './event-product-metadata.component.html',
  styleUrls: ['./event-product-metadata.component.scss']
})
export class EventProductMetadataComponent implements OnInit {
  @Input() set product(value: models.SarviewsProduct) {
    this.scenesMetadata = value.granules.map(
      scene => ({
        ...scene,
        granule_name: scene.granule_name.replace('__', '_')
      })
    ).reduce((prev, curr) => [...prev, {
      scene_name: curr.granule_name,
      beamMode: this.getBeamMode(curr.granule_name),
      polarization: this.getPolarization(curr.granule_name),
      absolute_orbit: this.getOrbit(curr.granule_name),
      acquisition_date: curr.acquisition_date,
      path: curr.path,
      frame: curr.frame

    }], [] as eventProductMetadata[]);
  }

 public scenesMetadata: eventProductMetadata[] = [];


  constructor() { }

  ngOnInit(): void {

  }

  private getBeamMode(sceneName: string): string {
    return sceneName.split('_')[1];
  }

  private getPolarization(sceneName: string): string {
    return Polarizations[sceneName.split('_')[3].slice(2)];
  }

  private getOrbit(sceneName: string): number {
    return +sceneName.split('_')[sceneName.split('_').length - 3];
  }
}
