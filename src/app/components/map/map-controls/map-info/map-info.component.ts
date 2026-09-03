import { DecimalPipe } from '@angular/common';
import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { LonLat } from '@models';
import * as services from '@services';

@Component({
  selector: 'app-map-info',
  templateUrl: './map-info.component.html',
  styleUrls: ['./map-info.component.scss'],
  imports: [DecimalPipe, TranslateModule],
})
export class MapInfoComponent implements AfterViewInit {
  private mapService = inject(services.MapService);

  @ViewChild('mapScaleComp', { static: true }) mapScale;
  @Input() public mousePos: LonLat;

  ngAfterViewInit() {
    this.mapService.addScaleLine(this.mapScale.nativeElement);
  }
}
