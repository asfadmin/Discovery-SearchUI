import { Component, OnInit, inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filterStore from '@store/filters';
import * as userStore from '@store/user';
import * as uiStore from '@store/ui';

import { SavedSearchService, NotificationService } from '@services';
import * as models from '@models';

import { AsfLanguageService } from '@services/asf-language.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatHint } from '@angular/material/input';
import { SearchFiltersComponent } from '../../sidebar/saved-searches/saved-search/search-filters/search-filters.component';
import { MatButton } from '@angular/material/button';
import { UpperCasePipe, TitleCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-save-search-dialog',
  templateUrl: './save-search-dialog.component.html',
  styleUrls: ['./save-search-dialog.component.scss'],
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    FormsModule,
    MatFormField,
    MatInput,
    MatHint,
    SearchFiltersComponent,
    MatDialogActions,
    MatButton,
    UpperCasePipe,
    TitleCasePipe,
    TranslateModule,
  ],
})
export class SaveSearchDialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<SaveSearchDialogComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);
  private store$ = inject<Store<AppState>>(Store);
  private savedSearchService = inject(SavedSearchService);
  private notificationService = inject(NotificationService);
  language = inject(AsfLanguageService);

  public search: models.Search;
  public searchTranslation = models.SearchTypeTranslation;

  public searchType: models.SearchType;

  public saveName: string;
  public isNameError = false;

  public saveType: models.SidebarType;
  public saveTypeName: string;

  ngOnInit(): void {
    this.saveType = this.data.saveType;
    if (this.saveType === models.SidebarType.SAVED_SEARCHES) {
      this.saveTypeName = 'SAVE_SEARCH';

      this.store$
        .select(filterStore.getGeocodeArea)
        .pipe(take(1))
        .subscribe((geocode) => {
          this.search = this.savedSearchService.makeCurrentSearch(
            geocode ?? '',
          );
          this.saveName = geocode;

          if (!this.searchCanBeSaved(this.search)) {
            this.onCancelSave();
          }
        });
    }
  }

  public onSaveNameChange(event: Event): void {
    const htmlEvent = event.target as HTMLInputElement;
    this.saveName = htmlEvent.value;
  }

  public onSaveNameInput(event: Event): void {
    const htmlEvent = event.target as HTMLInputElement;
    this.saveName = htmlEvent.value;
  }

  public onCancelSave(): void {
    this.store$.dispatch(new uiStore.CloseSidebar());
    this.dialogRef.close();
  }

  public onSubmitSave(): void {
    if (this.saveType === models.SidebarType.SAVED_SEARCHES) {
      this.store$.dispatch(
        new userStore.AddNewSearch({
          ...this.search,
          name: this.saveName,
        }),
      );
      this.savedSearchService.saveSearches();
    }

    const addName = ` as '${this.saveName}'`;
    const searchTypeKey =
      models.SearchTypeTranslation[this.search.searchType] ??
      this.search.searchType;
    const searchTypeTranslated = this.language.translate.instant(searchTypeKey);
    this.notificationService.info(
      `Saved current ${searchTypeTranslated}${this.saveName ? addName : ''}`,
    );
    this.dialogRef.close();
  }

  private searchCanBeSaved(search: models.Search): boolean {
    const maxLen = 10000;

    if (search.searchType === models.SearchType.DATASET) {
      const filters = search.filters as models.GeographicFiltersType;
      const len = filters.polygon !== null ? filters.polygon.length : 0;

      if (len > maxLen) {
        this.notifyUserListTooLong(len, 'Polygon');
        return false;
      }
    } else if (search.searchType === models.SearchType.LIST) {
      const filters = search.filters as models.ListFiltersType;
      const len = filters.list.join(',').length;

      if (len > maxLen) {
        this.notifyUserListTooLong(len, 'List');
        return false;
      }
    }

    return true;
  }

  private notifyUserListTooLong(len: number, strType: string): void {
    this.notificationService.error(
      `${strType} too long, must be under 10,000 characters to save (${len.toLocaleString()})`,
      `ERROR`,
      { timeOut: 6000 },
    );
  }
}
