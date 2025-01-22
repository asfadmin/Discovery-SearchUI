import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-map-legend',
  standalone: true,
  imports: [],
  templateUrl: './map-legend.component.html',
  styleUrl: './map-legend.component.scss'
})
export class MapLegendComponent {
  @Input() min: number;
  @Input() max: number;
  @Input() units: string;
}
