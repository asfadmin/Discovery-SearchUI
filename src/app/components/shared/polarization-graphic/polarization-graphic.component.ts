import { Component, input } from '@angular/core';

@Component({
  selector: 'app-polarization-graphic',
  imports: [],
  templateUrl: './polarization-graphic.component.html',
  styleUrl: './polarization-graphic.component.scss',
})
export class PolarizationGraphicComponent {
  polarization = input<string>();
}
