import { Component, inject } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-help-geo-search',
  templateUrl: './help-geo-search.component.html',
  styleUrls: ['./help-geo-search.component.scss']
})
export class HelpGeoSearchComponent {
  translate = inject(TranslateService);


}
