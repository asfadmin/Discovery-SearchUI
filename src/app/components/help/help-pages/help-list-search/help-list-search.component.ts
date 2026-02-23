import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-help-list-search',
  templateUrl: './help-list-search.component.html',
  styleUrls: ['./help-list-search.component.scss'],
  imports: [MatIcon, TranslateModule],
})
export class HelpListSearchComponent {}
