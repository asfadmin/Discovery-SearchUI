import { Component, Input } from '@angular/core';
import { DisplacementFiltersType } from '@models';

@Component({
  selector: 'app-displacement-filters',
  templateUrl: './displacement-filters.component.html',
  styleUrl: './displacement-filters.component.scss',
  standalone: false,
})
export class DisplacementFiltersComponent {
  @Input() filters: DisplacementFiltersType;
}
