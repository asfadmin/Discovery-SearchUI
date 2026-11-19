import { Component, input } from '@angular/core';

@Component({
  selector: 'app-map-legend',
  templateUrl: './map-legend.component.html',
  styleUrl: './map-legend.component.scss',
})
export class MapLegendComponent {
  readonly min = input<number>();
  readonly max = input<number>();
  readonly units = input<string>();
}
