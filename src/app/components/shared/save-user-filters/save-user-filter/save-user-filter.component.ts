import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
export class SaveUserFilterComponent implements OnInit {
  @ViewChild('nameEditInput') nameEditInput: ElementRef;

  @Input() filterPreset: {name: string, searchType: SearchType, filter: FilterType};
  public SearchType = models.SearchType;
  public expanded = false;
  public isEditingName = false;
  public editName: string;
  public lockedFocus = false;
  constructor(private store$: Store<AppState>) { }

  ngOnInit(): void {
  }

  public togglePanel() {
    this.expanded = !this.expanded;
  }

  public loadPreset(filterPreset: {name: string, searchType: SearchType, filter: FilterType}) {
    this.store$.dispatch(new userStore.LoadFiltersPreset(filterPreset.name));
  }

  public onDeletePreset() {
    this.store$.dispatch(new userStore.DeleteFiltersPreset(this.filterPreset.name));
  }

  public onNewName(newName: string) {
    this.isEditingName = false;
    this.editName = '';

    // const payload = {newName, oldName: this.filterPreset.name } as {newName: string, oldName: string}
    this.store$.dispatch(new userStore.UpdateFilterPresetName({newName, oldName: this.filterPreset.name }));
    // this.updateName.emit({ name: newName});
  }

  public onEditName() {
    this.isEditingName = true;
    this.editName = this.filterPreset.name === '(No title)' ?
      '' : this.filterPreset.name;

    timer(20).subscribe(
      _ => this.nameEditInput.nativeElement.focus()
    );
  }

    public onEditFocusLeave(): void {
      // if (this.lockedFocus) {
      //   this.nameEditInput.nativeElement.unfocus();
      //   // this.unlockFocus.emit();
      //   return;
      // }
    }
}
