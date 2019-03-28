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
  @Input() missionsByPlatform: {[platform: string]: string[]} = {};
  @Input() missionPlatforms: string[] = [];

  @Output() newMissionSelected = new EventEmitter<string>();

  public filteredMissions: string[];
  public platformFilter: string | null;

  stateForm: FormGroup = this.fb.group({
    missionFilter: '',
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.stateForm.get('missionFilter').valueChanges
      .pipe(
        startWith(''),
        map(filterValue => this._filterGroup(filterValue))
      ).subscribe(
        filtered => this.filteredMissions = filtered
      );
  }

  private _filterGroup(filterValue: string): string[] {
    return _filter(
      Object.values(this.missionsByPlatform).reduce(
      (allMissions, missions) => [...allMissions, ...missions], []
    ), filterValue).slice(0, 20);
  }

  public setMission(mission: string): void {
    console.log('Selected', mission);
  }
}
