import { Component, Input } from '@angular/core';
import { DisplacementFiltersType } from '@models';

@Component({
  selector: 'app-displacement-filters',
  standalone: false,
  templateUrl: './displacement-filters.component.html',
  styleUrl: './displacement-filters.component.scss'
})
export class DisplacementFiltersComponent {
  @Input() filters: DisplacementFiltersType;

}
