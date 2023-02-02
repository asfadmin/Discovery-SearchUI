import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';

import { LonLat } from '@models';
import * as services from '@services';

@Component({
  selector: 'app-map-info',
  templateUrl: './map-info.component.html',
  styleUrls: ['./map-info.component.scss']
})
export class MapInfoComponent implements OnInit, AfterViewInit {
  @ViewChild('mapScaleComp', { static: true }) mapScale;
  @Input() public mousePos: LonLat;

  constructor(
    private mapService: services.MapService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.mapService.addScaleLine(this.mapScale.nativeElement)
  }
}
