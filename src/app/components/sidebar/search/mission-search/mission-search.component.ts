import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { startWith, map, filter, tap } from 'rxjs/operators';

export interface StateGroup {
  letter: string;
  names: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};


@Component({
  selector: 'app-mission-search',
  templateUrl: './mission-search.component.html',
  styleUrls: ['./mission-search.component.css']
})
export class MissionSearchComponent implements OnInit {
  @Input() missionsByPlatform$: Observable<{[platform: string]: string[]}>;
  @Input() missionPlatforms$: Observable<string[]>;

  @Output() newMissionSelected = new EventEmitter<string>();

  public missionsByPlatform: {[platform: string]: string[]};
  public missionPlatforms: string[];

  public filteredMissions: string[];
  public platformFilter: string | null;

  public pageSizeOptions = [5, 10, 25];
  public pageSize = this.pageSizeOptions[1];
  public pageIndex = 0;

  stateForm: FormGroup = this.fb.group({
    missionFilter: '',
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.missionsByPlatform$.subscribe(
      missions => {
        this.missionsByPlatform = missions;
        this.filteredMissions = this._filterGroup('');
      }
    );

    this.missionPlatforms$.subscribe(
      platforms => this.missionPlatforms = platforms
    );

    this.stateForm.get('missionFilter').valueChanges
      .pipe(
        startWith(''),
        map(filterValue => this._filterGroup(filterValue))
      ).subscribe(
        filtered => this.filteredMissions = filtered
      );
  }

  private _filterGroup(filterValue: string): string[] {
    const missionsUnfiltered = Object.values(this.missionsByPlatform).reduce(
      (allMissions, missions) => [...allMissions, ...missions], []
    );

    return filterValue === '' ? missionsUnfiltered : _filter(missionsUnfiltered, filterValue);
  }

  public setMission(mission: string): void {
    console.log('Selected', mission);
  }

  public currentPageOf(missions, pageSize, pageIndex): string[] {
    const offset = pageIndex * pageSize;
    return missions.slice(offset, offset + pageSize);
  }

  public onNewPage(page): void {
    this.pageIndex = page.pageIndex;
    this.pageSize = page.pageSize;
  }
}
