import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { startWith, map, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import * as models from '@models';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider, MatNavList, MatListItem } from '@angular/material/list';
import {
  CdkVirtualScrollViewport,
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
} from '@angular/cdk/scrolling';
import { TranslateModule } from '@ngx-translate/core';

export interface StateGroup {
  letter: string;
  names: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item) => item.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-mission-selector',
  templateUrl: './mission-selector.component.html',
  styleUrls: ['./mission-selector.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,

    MatIcon,
    MatTooltip,
    MatDivider,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    MatNavList,
    CdkVirtualForOf,
    MatListItem,
    TranslateModule,
  ],
})
export class MissionSelectorComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private fb = inject(UntypedFormBuilder);

  public dataset$ = this.store$.select(filtersStore.getSelectedDataset);

  public missionsByDataset = this.store$.selectSignal(
    filtersStore.getMissionsByDataset,
  );

  public selectedMission = this.store$.selectSignal(
    filtersStore.getSelectedMission,
  );

  public filteredMissions: string[];
  public datasetFilter: string | null = null;
  public currentFilter = '';

  public pageSizeOptions = [5, 10, 25];
  public pageSize = this.pageSizeOptions[0];
  public pageIndex = 0;
  private subs = new SubSink();

  stateForm: UntypedFormGroup = this.fb.group({
    missionFilter: '',
  });

  ngOnInit() {
    this.subs.add(
      this.store$.select(filtersStore.getMissionsByDataset).subscribe((_) => {
        this.filteredMissions = this._filterGroup(this.currentFilter);
      }),
    );

    this.subs.add(
      this.dataset$
        .pipe(
          map((dataset) => {
            return dataset.id === models.beta.id
              ? models.MissionDataset.S1_BETA
              : dataset.name;
          }),
        )
        .subscribe((name) => {
          this.datasetFilter = name;
          this.stateForm.patchValue({
            missionFilter: '',
          });
          this.filteredMissions = this._filterGroup(this.currentFilter);
        }),
    );

    this.subs.add(
      this.stateForm
        .get('missionFilter')
        .valueChanges.pipe(
          startWith(this.currentFilter),
          tap((filterValue) => (this.currentFilter = filterValue)),
          map((filterValue) => this._filterGroup(filterValue)),
        )
        .subscribe((filtered) => (this.filteredMissions = filtered)),
    );
  }

  private _filterGroup(filterValue: string): string[] {
    const missionsUnfiltered = this.datasetFilter
      ? this.missionsByDataset()[this.datasetFilter]
      : Object.values(this.missionsByDataset()).reduce(
          (allMissions, missions) => [...allMissions, ...missions],
          [],
        );

    return filterValue === ''
      ? missionsUnfiltered
      : _filter(missionsUnfiltered, filterValue);
  }

  public setMission(mission: string): void {
    this.store$.dispatch(new filtersStore.SelectMission(mission));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
