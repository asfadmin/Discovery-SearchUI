import { Component } from '@angular/core';

import { FullBurstSelectorComponent } from './full-burst-selector/full-burst-selector.component';

@Component({
  selector: 'app-burst-selector',
  templateUrl: './burst-selector.component.html',
  styleUrls: ['./burst-selector.component.scss'],
  imports: [FullBurstSelectorComponent],
})
export class BurstSelectorComponent {}
