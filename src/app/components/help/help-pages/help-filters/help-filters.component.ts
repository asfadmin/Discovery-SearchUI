import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-help-filters',
  templateUrl: './help-filters.component.html',
  styleUrls: ['./help-filters.component.scss'],
  imports: [MatIcon, TranslateModule],
})
export class HelpFiltersComponent {}
