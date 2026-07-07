import { Component, Input } from '@angular/core';
import { MatCard, MatCardSubtitle } from '@angular/material/card';
import { Observable } from 'rxjs';

import { ScenesListHeaderComponent } from '../scenes-list-header/scenes-list-header.component';
import { ScenesListComponent } from '../scenes-list/scenes-list.component';

@Component({
  selector: 'app-sbas-baseline-results-menu',
  imports: [
    MatCard,
    MatCardSubtitle,
    ScenesListHeaderComponent,
    ScenesListComponent,
  ],
  templateUrl: './sbas-baseline-results-menu.component.html',
  styleUrls: [
    './sbas-baseline-results-menu.component.scss',
    '../results-menu.component.scss',
  ],
})
export class SbasBaselineResultsMenuComponent {
  @Input() resize$: Observable<void>;
}
