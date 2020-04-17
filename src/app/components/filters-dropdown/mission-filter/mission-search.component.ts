import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { startWith, map, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

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
  selector: 'app-mission-search',
  templateUrl: './mission-search.component.html',
  styleUrls: ['./mission-search.component.css']
})
export class MissionSearchComponent implements OnInit, OnDestroy {
  @Input() missionsByDataset$: Observable<{[dataset: string]: string[]}>;
  @Input() missionDatasets$: Observable<string[]>;
  @Input() selectedMission: string | null;
  @Input() dataset$: Observable<models.Dataset>;

  @Output() newMissionSelected = new EventEmitter<string>();

  public missionsByDataset: {[dataset: string]: string[]};
  public missionDatasets: string[];

  public filteredMissions: string[];
  public datasetFilter: string | null = null;
  public currentFilter = '';

  public pageSizeOptions = [5, 10, 25];
  public pageSize = this.pageSizeOptions[0];
  public pageIndex = 0;
  private subs = new SubSink();

  stateForm: FormGroup = this.fb.group({
    missionFilter: '',
  });

  constructor(private fb: FormBuilder) {}

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
      this.missionDatasets$.subscribe(
        datasets => this.missionDatasets = datasets
      )
    );

    this.subs.add(
      this.dataset$.pipe(
        map(dataset => dataset.name.toLowerCase().includes('beta') ? models.MissionDataset.S1_BETA : dataset.name)
      ).subscribe(name => this.datasetFilter = name)
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

  public selectDatasetFilter(dataset: string): void {
    this.datasetFilter = dataset;
    this.filteredMissions = this._filterGroup(this.currentFilter);
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
    this.newMissionSelected.emit(mission);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
