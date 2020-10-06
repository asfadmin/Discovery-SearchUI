import { Component, OnInit, Input } from '@angular/core';

import { tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';
import * as filtersStore from '@store/filters';

@Component({
  selector: 'app-project-name-selector',
  templateUrl: './project-name-selector.component.html',
  styleUrls: ['./project-name-selector.component.scss']
})
export class ProjectNameSelectorComponent implements OnInit {
  @Input() processName = false;

  public projectNames: string[] = [];
  public projectNamesFiltered = [];
  public projectName = '';

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.store$.select(hyp3Store.getHyp3User).pipe(
      tap(user => {
        if (user === null) {
          this.store$.dispatch(new hyp3Store.LoadUser());
        }
      })
    ).subscribe(user => {
      if (user) {
        this.projectNames = [ ...user.job_names, ];
        this.projectNamesFiltered = [ ...user.job_names, ];
      }
    });
  }

  public onProjectNameChange(projectName): void {
    this.projectName = projectName;

    const action = (!this.processName) ?
      new filtersStore.SetProjectName(projectName === '' ? null : projectName) :
      new hyp3Store.SetProcessingProjectName(projectName);

    this.store$.dispatch(action);
  }

  public onProjectNameInput(projectName): void {
    const filterValue = projectName.toLowerCase();

    this.projectNamesFiltered = this.projectNames.filter(
      option => option.toLowerCase().includes(filterValue)
    );
  }
}
