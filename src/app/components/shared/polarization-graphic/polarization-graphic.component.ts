import { Component, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-polarization-graphic',
  imports: [MatTooltipModule],
  templateUrl: './polarization-graphic.component.html',
  styleUrl: './polarization-graphic.component.scss',
})
export class PolarizationGraphicComponent {
  polarization = input<string>();
}
