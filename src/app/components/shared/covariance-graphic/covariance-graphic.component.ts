import { Component, computed, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-covariance-graphic',
  imports: [MatTooltipModule, TranslatePipe],
  templateUrl: './covariance-graphic.component.html',
  styleUrl: './covariance-graphic.component.scss',
})
export class CovarianceGraphicComponent {
  covariance = input<string>();
  xPolarization = computed(() =>
    this.covariance().slice(0, this.covariance().length / 2),
  );
  yPolarization = computed(() =>
    this.covariance().slice(this.covariance().length / 2),
  );
}
