import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-help-baseline-search',
  templateUrl: './help-baseline-search.component.html',
  styleUrls: ['./help-baseline-search.component.scss'],
  imports: [MatIcon, TranslateModule],
})
export class HelpBaselineSearchComponent {}
