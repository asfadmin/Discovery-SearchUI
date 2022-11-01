import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { startWith, map, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import * as models from '@models';

export interface StateGroup {
  letter: string;
  names: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().includes(filterValue));
};


@Component({
  selector: 'app-mission-selector',
  templateUrl: './mission-selector.component.html',
  styleUrls: ['./mission-selector.component.css']
})
export class MissionSelectorComponent implements OnInit, OnDestroy {
  public missionsByDataset$ = this.store$.select(filtersStore.getMissionsByDataset);
  public missionDatasets$ = this.missionsByDataset$.pipe(
    map(missions => Object.keys(missions))
  );
  public dataset$ = this.store$.select(filtersStore.getSelectedDataset);

  public missionsByDataset: {[dataset: string]: string[]};
  public missionDatasets: string[];
  public selectedMission: string | null;

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

  constructor(
    private store$: Store<AppState>,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit() {
    this.subs.add(
      this.missionsByDataset$.subscribe(
        missions => {
          this.missionsByDataset = missions;
          this.filteredMissions = this._filterGroup(this.currentFilter);
        }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getSelectedMission).subscribe(
        selected => this.selectedMission = selected
      )
    );

    this.subs.add(
      this.missionDatasets$.subscribe(
        datasets => this.missionDatasets = datasets
      )
    );

    this.subs.add(
      this.dataset$.pipe(
        map(dataset => {
          return dataset.name.toLowerCase().includes('s1 insar') ?
            models.MissionDataset.S1_BETA :
            dataset.name;
        })
      ).subscribe(name => {
        this.datasetFilter = name;
        this.stateForm.patchValue({
          'missionFilter': ''
        });
        this.filteredMissions = this._filterGroup(this.currentFilter);
      })
    );

    this.subs.add(
      this.stateForm.get('missionFilter').valueChanges
        .pipe(
          startWith(this.currentFilter),
          tap(filterValue => this.currentFilter = filterValue),
          map(filterValue => this._filterGroup(filterValue))
        ).subscribe(
          filtered => this.filteredMissions = filtered
        )
    );
  }

  private _filterGroup(filterValue: string): string[] {

    const missionsUnfiltered = this.datasetFilter ?
      this.missionsByDataset[this.datasetFilter] :
      Object.values(this.missionsByDataset).reduce(
      (allMissions, missions) => [...allMissions, ...missions], []
    );

    return filterValue === '' ?
      missionsUnfiltered :
      _filter(missionsUnfiltered, filterValue);
  }

  public setMission(mission: string): void {
    this.store$.dispatch(new filtersStore.SelectMission(mission));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
