import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-icon',
  templateUrl: './filter-icon.component.html',
  styleUrls: ['./filter-icon.component.scss']
})
export class FilterIconComponent {
  @Input() name: string;
  @Input() filterTitle: string;
  @Input() isSelected: boolean;
}
