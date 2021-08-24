import { Component, EventEmitter, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as models from '@models';
import * as userStore from '@store/user';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { timer } from 'rxjs';
import { NotificationService } from '@services';

@Component({
  selector: 'app-save-user-filter',
  templateUrl: './save-user-filter.component.html',
  styleUrls: ['./save-user-filter.component.scss']
})
export class SaveUserFilterComponent implements OnInit {
  @ViewChild('nameEditInput') nameEditInput: ElementRef;

  @Input() filterPreset: models.SavedFilterPreset;
  @Input() isNew: boolean;

  @Output() updateName = new EventEmitter<string>();

  public SearchType = models.SearchType;
  public expanded = false;
  public isEditingName = false;
  public editName: string;
  public lockedFocus = false;
  constructor(
    private store$: Store<AppState>,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    if (this.isNew) {
      this.onEditName();
    }
  }

  public togglePanel() {
    this.expanded = !this.expanded;
  }

  public loadPreset() {
    this.store$.dispatch(new userStore.LoadFiltersPreset(this.filterPreset.id));

    const fromName = this.filterPreset.name ? `from '${this.filterPreset.name}'` : ``;
    this.notificationService.info(
      `Applied filters ${fromName}`
    );
  }

  public onDeletePreset() {
    this.store$.dispatch(new userStore.DeleteFiltersPreset(this.filterPreset.id));
    this.store$.dispatch(new userStore.SaveFilters());
  }

  public onNewName(event: Event) {
    const newName = (event.target as HTMLInputElement).value;
    this.isEditingName = false;
    this.editName = '';

    this.store$.dispatch(new userStore.UpdateFilterPresetName({newName, presetID: this.filterPreset.id }));
    this.store$.dispatch(new userStore.SaveFilters());

    this.updateName.emit(this.filterPreset.id);
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
