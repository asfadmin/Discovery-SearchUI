import { Component, inject } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-help-geo-search',
  templateUrl: './help-geo-search.component.html',
  styleUrls: ['./help-geo-search.component.scss'],
  imports: [MatIcon, TranslateModule],
})
export class HelpGeoSearchComponent {
  translate = inject(TranslateService);
}
