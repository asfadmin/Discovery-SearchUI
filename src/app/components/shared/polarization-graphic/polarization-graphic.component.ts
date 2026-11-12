import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-polarization-graphic',
  imports: [],
  templateUrl: './polarization-graphic.component.html',
  styleUrl: './polarization-graphic.component.scss',
})
export class PolarizationGraphicComponent {
  polarizations = input<string[]>();
  transmit_polarizations = computed(() =>
    this.polarizations().map((polarization) => polarization[1]),
  );
  receive_polarizations = computed(() =>
    this.polarizations().map((polarization) => polarization[0]),
  );
}
