import { Component, Input } from '@angular/core';
import {MatSlider, MatSliderThumb} from '@angular/material/slider';

@Component({
    selector: 'app-map-legend',
    imports: [
        MatSlider,
        MatSliderThumb
    ],
    templateUrl: './map-legend.component.html',
    styleUrl: './map-legend.component.scss'
})
export class MapLegendComponent {
  @Input() min: number;
  @Input() max: number;
  @Input() units: string;
}
