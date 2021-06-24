import { Component, Input, OnInit } from '@angular/core';
import { FilterType, SearchType } from '@models';
import * as models from '@models'
import * as userStore from '@store/user';
import { Store } from '@ngrx/store';
import { AppState } from '@store';

@Component({
  selector: 'app-save-user-filter',
  templateUrl: './save-user-filter.component.html',
  styleUrls: ['./save-user-filter.component.scss']
})
export class SaveUserFilterComponent implements OnInit {
  @Input() filterPreset: {name: string, searchType: SearchType, filter: FilterType};
  public SearchType = models.SearchType;
  public expanded = false;
  constructor(private store$: Store<AppState>) { }

  ngOnInit(): void {
  }

  public togglePanel() {
    this.expanded = !this.expanded;
  }

  public loadPreset(filterPreset: {name: string, searchType: SearchType, filter: FilterType}) {
    this.store$.dispatch(new userStore.LoadFiltersPreset(filterPreset.name));
  }

}
