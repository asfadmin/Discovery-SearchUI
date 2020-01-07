import { Component, OnInit } from '@angular/core';

import { SavedSearchService } from '@services';

@Component({
  selector: 'app-saved-searches',
  templateUrl: './saved-searches.component.html',
  styleUrls: ['./saved-searches.component.scss']
})
export class SavedSearchesComponent implements OnInit {

  constructor(
    private savedSearchService: SavedSearchService
  ) { }

  ngOnInit() {
    this.savedSearchService.addCurrentSearch('New Search');
  }

}
