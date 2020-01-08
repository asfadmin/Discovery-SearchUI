import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-saved-search',
  templateUrl: './saved-search.component.html',
  styleUrls: ['./saved-search.component.scss']
})
export class SavedSearchComponent {
  @Input() search: models.Search;
  @Input() searchType: models.SearchType;

  @Output() updateFilters = new EventEmitter<string>();
  @Output() updateName = new EventEmitter<{ id: string, name: string }>();
  @Output() deleteSearch = new EventEmitter<string>();

  public isEditingName = false;
  public editName = '';

  public onUpdateFilters(id: string): void {
    this.updateFilters.emit(id);
  }

  public onUpdateName(id: string, name: string): void {
    this.updateName.emit({ id, name });
  }

  public onEditName(): void {
    this.isEditingName = true;
    this.editName = '';
  }

  public onNewName(newName: string): void {
    this.isEditingName = false;
    this.editName = '';

    this.updateName.emit({ name: newName, id: this.search.id });
  }

  public onDeleteSearch(): void {
    this.deleteSearch.emit(this.search.id);
  }
}
