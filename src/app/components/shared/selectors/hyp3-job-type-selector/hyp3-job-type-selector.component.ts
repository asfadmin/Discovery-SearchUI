import { Component, OnInit, inject } from '@angular/core';
import { MatFormField } from '@angular/material/input';
import {
  MatSelectChange,
  MatSelect,
  MatOption,
} from '@angular/material/select';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SubSink } from 'subsink';

import * as models from '@models';
import { AppState } from '@store';
import { getHyp3ProductTypes, SetHyp3ProductTypes } from '@store/filters';

import {} from '@angular/common';

@Component({
  selector: 'app-hyp3-job-type-selector',
  templateUrl: './hyp3-job-type-selector.component.html',
  styleUrls: ['./hyp3-job-type-selector.component.scss'],
  imports: [MatFormField, MatSelect, MatOption, TranslateModule],
})
export class Hyp3JobTypeSelectorComponent implements OnInit {
  store$ = inject<Store<AppState>>(Store);

  public hyp3JobTypes = Object.keys(models.hyp3JobTypes);
  public selected: string[] = [];

  public subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.store$
        .select(getHyp3ProductTypes)
        .subscribe(
          (selected) =>
            (this.selected = selected.map((prodType) => prodType.id)),
        ),
    );
  }

  onSelect(selectionChange: MatSelectChange) {
    this.store$.dispatch(new SetHyp3ProductTypes(selectionChange.value));
    // }
  }
}
