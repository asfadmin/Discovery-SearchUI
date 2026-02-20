import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-help-search-results',
  templateUrl: './help-search-results.component.html',
  styleUrls: ['./help-search-results.component.scss'],
  imports: [MatIcon, TranslateModule],
})
export class HelpSearchResultsComponent {}
