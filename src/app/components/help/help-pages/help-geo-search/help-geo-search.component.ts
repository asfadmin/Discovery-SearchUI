import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-help-geo-search',
    templateUrl: './help-geo-search.component.html',
    styleUrls: ['./help-geo-search.component.scss'],
    standalone: false
})
export class HelpGeoSearchComponent implements OnInit {

  constructor(
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
  }

}
