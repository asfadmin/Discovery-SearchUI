import { Component, effect, signal, inject } from '@angular/core';
import { debounce, form, FormField } from '@angular/forms/signals';
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
  granuleListForm = form(this.granuleListModel, (schemaPath) => {
    debounce(schemaPath.list, 500);
    // TODO: add validator for granule wildcard requirements. No leading char, no more than 4(or more?) granules
    // Probably just a regex validator?
  });
  constructor() {
    effect(() => {
      this.store$.dispatch(
        new filtersStore.setGranuleList(this.granuleListModel().list),
      );
    });
  }
}
