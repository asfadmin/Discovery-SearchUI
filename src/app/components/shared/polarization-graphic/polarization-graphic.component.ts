import { Component, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-polarization-graphic',
  imports: [MatTooltipModule, TranslatePipe],
  templateUrl: './polarization-graphic.component.html',
  styleUrl: './polarization-graphic.component.scss',
})
export class PolarizationGraphicComponent {
  polarization = input<string>();
}
