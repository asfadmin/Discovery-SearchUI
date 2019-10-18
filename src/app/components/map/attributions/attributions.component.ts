import { Component, OnInit, Input } from '@angular/core';

import { LonLat } from '@models';

@Component({
  selector: 'app-attributions',
  templateUrl: './attributions.component.html',
  styleUrls: ['./attributions.component.scss'],
})
export class AttributionsComponent {
  anio: number = new Date().getFullYear();
}
