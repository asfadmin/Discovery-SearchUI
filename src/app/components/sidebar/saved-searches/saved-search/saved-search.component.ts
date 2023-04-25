import {
  Component, OnInit, Input, Output, EventEmitter,
  ViewChild, ElementRef, ChangeDetectionStrategy
} from '@angular/core';

import { timer } from 'rxjs';
import * as moment from 'moment';

import * as models from '@models';

import { AsfLanguageService } from "@services/asf-language.service";

@Component({
  selector: 'app-saved-search',
  templateUrl: './saved-search.component.html',
  styleUrls: ['./saved-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SavedSearchComponent implements OnInit {
  @ViewChild('nameEditInput') nameEditInput: ElementRef;

  @Input() search: models.Search;
  @Input() searchType: models.SearchType;
  @Input() isExpanded: boolean;
  @Input() isNew: boolean;
  @Input() isSavedSearch: boolean;
  @Input() lockedFocus: boolean;

  @Output() updateFilters = new EventEmitter<string>();
  @Output() updateName = new EventEmitter<{ id: string, name: string }>();
  @Output() deleteSearch = new EventEmitter<string>();
  @Output() setSearch = new EventEmitter<models.Search>();
  @Output() expand = new EventEmitter<string>();
  @Output() unlockFocus = new EventEmitter<void>();

  public SearchType = models.SearchType;
  public isEditingName = false;
  public editName = '';

  constructor(
    private language: AsfLanguageService,
  ) {
  }
  ngOnInit() {
    if (this.isNew) {
      this.onEditName();
    }
  }

  public onSetSearch(): void {
    this.setSearch.emit(this.search);
  }

  public onUpdateFilters(id: string): void {
    this.updateFilters.emit(id);
  }

  public onUpdateName(id: string, name: string): void {
    this.updateName.emit({ id, name });
  }

  public onEditName(): void {
    if (!this.isSavedSearch) {
      return;
    }

    this.isEditingName = true;
    this.editName = this.search.name === '(No title)' ?
      '' : this.search.name;

    timer(40).subscribe(
      _ => this.nameEditInput.nativeElement.focus()
    );
  }

  public onNewName(event: Event): void {
    const newName = (event.target as HTMLInputElement).value;
    this.isEditingName = false;
    this.editName = '';

    this.updateName.emit({ name: newName, id: this.search.id });
  }

  public onDeleteSearch(): void {
    this.deleteSearch.emit(this.search.id);
  }

  public onEditFocusLeave(): void {
    if (this.lockedFocus) {
      this.nameEditInput.nativeElement.focus();
      this.unlockFocus.emit();
      return;
    }

    this.isEditingName = false;

    this.updateName.emit({ name: this.editName, id: this.search.id });
    this.editName = '';
  }

  public listPreview(listFilter: models.ListFiltersType): string {
    const len = listFilter.list.length;
    const plural = len === 1 ? '' : 's';

    return `${len} ${listFilter.listType}${plural}`;
  }

  public formatDatesFor(filters: models.GeographicFiltersType): string {
    const range = filters.dateRange;

    const start = this.formatIfDate(range.start);
    const end = this.formatIfDate(range.end);

    if (!!start && !!end) {
      return ` - from ${start} to ${end}`;
    } else if (!start && !!end) {
      return ` - before ${end}`;
    } else if (!!start && !end) {
      return ` - after ${start}`;
    } else {
      return ``;
    }
  }

  public formatName(searchName: string): string {
    if (this.isSavedSearch) {
      const noName = this.language.translate.instant('NO_NAME');
      return !!searchName ? searchName : noName;
    } else {
      const date = this.formatIfDate(new Date(+searchName));
      return `(${date})`;
    }
  }

  private formatIfDate(date: Date | null): string | null {
    if (date === null) {
      return null;
    }

    const dateUtc = moment.utc(date);

    return dateUtc.format('MM DD YYYY');
  }

  public expandSearch(): void {
    this.expand.emit(this.search.id);
  }
}
