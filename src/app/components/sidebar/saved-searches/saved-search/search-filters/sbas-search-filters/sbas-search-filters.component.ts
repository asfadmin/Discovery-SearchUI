import { Component, OnInit, Input } from '@angular/core';

import { SbasFiltersType } from '@models';
import { EnvironmentService } from '@services';

@Component({
  selector: 'app-sbas-search-filters',
  templateUrl: './sbas-search-filters.component.html',
  styleUrls: ['./sbas-search-filters.component.scss']
})
export class SbasSearchFiltersComponent implements OnInit {
  @Input() filters: SbasFiltersType;

  public maturity = this.env.maturity;

  constructor(private env: EnvironmentService) { }

  ngOnInit(): void {
  }

}
