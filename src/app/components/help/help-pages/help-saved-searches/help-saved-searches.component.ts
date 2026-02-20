import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-help-saved-searches',
  templateUrl: './help-saved-searches.component.html',
  styleUrls: ['./help-saved-searches.component.scss'],
  imports: [MatIcon, TranslateModule],
})
export class HelpSavedSearchesComponent {}
