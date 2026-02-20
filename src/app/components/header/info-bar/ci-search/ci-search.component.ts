import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-ci-search',
  templateUrl: './ci-search.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./ci-search.component.scss'],
  standalone: true,
})
export class CiSearchComponent {
  constructor() {
    this.showSearch();
  }

  public showSearch() {
    const id = 'b8df7ea0-38a5-11eb-9b20-0242ac130002';
    const ci_search = document.createElement('script');
    ci_search.type = 'text/javascript';
    ci_search.async = true;
    ci_search.src = 'https://cse.expertrec.com/api/js/ci_common.js?id=' + id;
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ci_search, s);
  }
}
