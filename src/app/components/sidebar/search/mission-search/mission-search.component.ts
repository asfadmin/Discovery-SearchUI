import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { startWith, map, filter, tap } from 'rxjs/operators';

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
export class MissionSearchComponent implements OnInit {
  @Input() missionsByPlatform$: Observable<{[platform: string]: string[]}>;
  @Input() missionPlatforms$: Observable<string[]>;
  @Input() selectedMission: string | null;

  @Output() newMissionSelected = new EventEmitter<string>();

  public missionsByPlatform: {[platform: string]: string[]};
  public missionPlatforms: string[];

  public filteredMissions: string[];
  public platformFilter: string | null = null;
  public currentFilter = '';

  public pageSizeOptions = [5, 10, 25];
  public pageSize = this.pageSizeOptions[0];
  public pageIndex = 0;

  stateForm: FormGroup = this.fb.group({
    missionFilter: '',
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.missionsByPlatform$.subscribe(
      missions => {
        this.missionsByPlatform = missions;
        this.filteredMissions = this._filterGroup(this.currentFilter);
      }
    );

    this.missionPlatforms$.subscribe(
      platforms => this.missionPlatforms = platforms
    );

    this.stateForm.get('missionFilter').valueChanges
      .pipe(
        startWith(this.currentFilter),
        tap(filterValue => this.currentFilter = filterValue),
        map(filterValue => this._filterGroup(filterValue))
      ).subscribe(
        filtered => this.filteredMissions = filtered
      );
  }

  public selectPlatformFilter(platform: string): void {
    this.platformFilter = platform;
    this.filteredMissions = this._filterGroup(this.currentFilter);
  }

  private _filterGroup(filterValue: string): string[] {
    const missionsUnfiltered = this.platformFilter ?
      this.missionsByPlatform[this.platformFilter] :
      Object.values(this.missionsByPlatform).reduce(
      (allMissions, missions) => [...allMissions, ...missions], []
    );

    return filterValue === '' ?
      missionsUnfiltered :
      _filter(missionsUnfiltered, filterValue);
  }

  public setMission(mission: string): void {
    this.newMissionSelected.emit(mission);
  }
}
