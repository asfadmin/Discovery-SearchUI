import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SubSink } from 'subsink';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';
import * as filtersStore from '@store/filters';

@Component({
  selector: 'app-project-name-selector',
  templateUrl: './project-name-selector.component.html',
  styleUrls: ['./project-name-selector.component.scss']
})
export class ProjectNameSelectorComponent implements OnInit, OnDestroy {
  @ViewChild('projectNameForm') public projectNameForm: NgForm;
  @Input() processName = false;

  public nameErrors$ = new Subject<void>();
  public isNameError = false;

  public projectNames: string[] = [];
  public projectNamesFiltered = [];
  public projectName = '';
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.handleNameErrors();

    if (this.processName) {
      this.subs.add(
        this.store$.select(hyp3Store.getProcessingProjectName).subscribe(name => {
          this.projectName = name;
        })
      );
    }

    this.subs.add(
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
      })
    );
  }

  public onProjectNameChange(projectName): void {
    if (projectName.length > 20) {
      projectName = null;
      this.nameErrors$.next();
    }

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

  private handleNameErrors(): void {
    this.subs.add(
      this.nameErrors$.pipe(
        tap(_ => {
          this.snackBar.open('Project Name too long. (over 20 characters)', 'ERROR', {
            duration: 5000
          });
          this.isNameError = true;
          this.projectNameForm.reset();
          this.projectNameForm.form
            .controls['projectNameInput']
            .setErrors({'incorrect': true});
        }),
        delay(820),
      ).subscribe(_ => {
        this.isNameError = false;
        this.projectNameForm.form
          .controls['projectNameInput']
          .setErrors(null);
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
