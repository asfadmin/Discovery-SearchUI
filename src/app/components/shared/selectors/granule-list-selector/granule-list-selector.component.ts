import { Component, effect, signal, inject } from '@angular/core';
import { debounce, form, FormField, validate } from '@angular/forms/signals';
import {
  MatError,
  MatFormField,
  MatHint,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import * as filtersStore from '@store/filters';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-granule-list-selector',
  imports: [
    FormField,
    MatInput,
    MatFormField,
    MatLabel,
    TranslateModule,
    MatHint,
    MatError,
  ],
  templateUrl: './granule-list-selector.component.html',
  styleUrl: './granule-list-selector.component.scss',
})
export class GranuleListSelectorComponent {
  private store$ = inject(Store);

  granuleListModel = signal({
    list: '',
  });
  granuleList = this.store$.selectSignal(filtersStore.getGranuleList);

  constructor() {
    effect(() => {
      this.granuleListModel.set({
        list: this.granuleList(),
      });
    });
    effect(() => {
      if (this.granuleList() !== this.granuleListModel().list) {
        this.store$.dispatch(
          new filtersStore.setGranuleList(this.granuleListModel().list),
        );
      }
    });
  }

  granuleListForm = form(this.granuleListModel, (schemaPath) => {
    debounce(schemaPath.list, 500);
    validate(schemaPath.list, ({ value }) => {
      const CMRLeadingWildcardLimit = 5;
      if (
        value()
          ?.split(',')
          .filter((x) => x.trim().startsWith('*') || x.trim().startsWith('?'))
          .length > CMRLeadingWildcardLimit
      ) {
        return {
          kind: 'invalid',
          message: 'GRANULE_LIST_MAX_ERROR',
        };
      }
      return null;
    });
  });
}
