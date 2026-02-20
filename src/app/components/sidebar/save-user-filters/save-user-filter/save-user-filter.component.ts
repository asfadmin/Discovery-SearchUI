import {
  Component,
  EventEmitter,
  ElementRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import * as models from '@models';
import * as userStore from '@store/user';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { timer } from 'rxjs';
import { NotificationService } from '@services';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { GeographicSearchFiltersComponent } from '../../saved-searches/saved-search/search-filters/geographic-search-filters/geographic-search-filters.component';
import { BaselineSearchFiltersComponent } from '../../saved-searches/saved-search/search-filters/baseline-search-filters/baseline-search-filters.component';
import { SbasSearchFiltersComponent } from '../../saved-searches/saved-search/search-filters/sbas-search-filters/sbas-search-filters.component';
import {
  BaselineFilterPipe,
  SBASFilterPipe,
  GeographicFilterPipe,
} from '@pipes/filter-type.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-save-user-filter',
  templateUrl: './save-user-filter.component.html',
  styleUrls: ['./save-user-filter.component.scss'],
  imports: [
    MatIcon,
    FormsModule,
    MatFormField,
    MatInput,
    MatButton,
    GeographicSearchFiltersComponent,
    BaselineSearchFiltersComponent,
    SbasSearchFiltersComponent,
    BaselineFilterPipe,
    SBASFilterPipe,
    GeographicFilterPipe,
    TranslateModule,
  ],
})
export class SaveUserFilterComponent implements OnInit {
  private store$ = inject<Store<AppState>>(Store);
  private notificationService = inject(NotificationService);

  @ViewChild('nameEditInput') nameEditInput: ElementRef;

  @Input() filterPreset: models.SavedFilterPreset;
  @Input() isNew: boolean;

  @Output() updateName = new EventEmitter<string>();

  public SearchType = models.SearchType;
  public searchTranslation = models.SearchTypeTranslation;
  public expanded = false;
  public isEditingName = false;
  public editName: string;
  public lockedFocus = false;

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

    const fromName = this.filterPreset.name
      ? `from '${this.filterPreset.name}'`
      : ``;
    this.notificationService.info(`Applied filters ${fromName}`);
  }

  public onDeletePreset() {
    this.store$.dispatch(
      new userStore.DeleteFiltersPreset(this.filterPreset.id),
    );
    this.store$.dispatch(new userStore.SaveFilters());
  }

  public onNewName(event: Event) {
    const newName = (event.target as HTMLInputElement).value;
    this.isEditingName = false;
    this.editName = '';

    this.store$.dispatch(
      new userStore.UpdateFilterPresetName({
        newName,
        presetID: this.filterPreset.id,
      }),
    );
    this.store$.dispatch(new userStore.SaveFilters());

    this.updateName.emit(this.filterPreset.id);
  }

  public onEditName() {
    this.isEditingName = true;
    this.editName =
      this.filterPreset.name === '(No title)' ? '' : this.filterPreset.name;

    timer(20).subscribe((_) => this.nameEditInput.nativeElement.focus());
  }
}
