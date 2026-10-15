import { DecimalPipe } from '@angular/common';
import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SubSink } from 'subsink';

import { LonLat } from '@models';
import * as services from '@services';

@Component({
  selector: 'app-map-info',
  templateUrl: './map-info.component.html',
  styleUrls: ['./map-info.component.scss'],
  imports: [DecimalPipe, TranslateModule],
})
export class MapInfoComponent implements AfterViewInit, OnDestroy {
  private mapService = inject(services.MapService);
  private subs = new SubSink();

  @ViewChild('mapScaleComp', { static: true }) mapScale;
  @Input() public mousePos: LonLat;

  public isAtZoomLimit = signal(false);

  ngAfterViewInit() {
    this.mapService.addScaleLine(this.mapScale.nativeElement);

    this.subs.add(
      this.mapService.zoomLimitReached$.subscribe(() => {
        const reduceMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches;

        if (!reduceMotion) {
          this.isAtZoomLimit.set(true);
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
