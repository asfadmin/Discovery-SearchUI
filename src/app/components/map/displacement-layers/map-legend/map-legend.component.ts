import { Component, input } from '@angular/core';

@Component({
  selector: 'app-map-legend',
  templateUrl: './map-legend.component.html',
  styleUrl: './map-legend.component.scss',
})
export class MapLegendComponent {
  readonly min = input<number>(undefined);
  readonly max = input<number>(undefined);
  readonly units = input<string>(undefined);
}
