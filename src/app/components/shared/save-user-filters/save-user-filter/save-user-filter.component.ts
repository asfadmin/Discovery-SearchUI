import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FilterType, SearchType } from '@models';
import * as models from '@models'
import * as userStore from '@store/user';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { timer } from 'rxjs';
@Component({
  selector: 'app-save-user-filter',
  templateUrl: './save-user-filter.component.html',
  styleUrls: ['./save-user-filter.component.scss']
})
export class SaveUserFilterComponent {
  @ViewChild('nameEditInput') nameEditInput: ElementRef;

  @Input() filterPreset: {name: string, id: string, searchType: SearchType, filters: FilterType};
  public SearchType = models.SearchType;
  public expanded = false;
  public isEditingName = false;
  public editName: string;
  public lockedFocus = false;
  constructor(private store$: Store<AppState>) { }

  public togglePanel() {
    this.expanded = !this.expanded;
  }

  public loadPreset(filterPreset: {name: string, id: string, searchType: SearchType, filters: FilterType}) {
    this.store$.dispatch(new userStore.LoadFiltersPreset(filterPreset.id));
  }

  public onDeletePreset() {
    this.store$.dispatch(new userStore.DeleteFiltersPreset(this.filterPreset.id));
    this.store$.dispatch(new userStore.SaveFilters());
  }

  public onNewName(newName: string) {
    this.isEditingName = false;
    this.editName = '';

    this.store$.dispatch(new userStore.UpdateFilterPresetName({newName, presetID: this.filterPreset.id }));
    this.store$.dispatch(new userStore.SaveFilters());
  }

  public onEditName() {
    this.isEditingName = true;
    this.editName = this.filterPreset.name === '(No title)' ?
      '' : this.filterPreset.name;

    timer(20).subscribe(
      _ => this.nameEditInput.nativeElement.focus()
    );
  }
}
