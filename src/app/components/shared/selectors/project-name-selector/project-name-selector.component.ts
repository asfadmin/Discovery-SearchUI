import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SubSink } from 'subsink';

import { combineLatest, Subject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';
import * as filtersStore from '@store/filters';
import { NotificationService } from '@services/notification.service';
import { ScenesService } from '@services';

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
  public filterValue: string | null = null;
  private subs = new SubSink();
  readonly maxProjectNameLength = 100;

  constructor(
    private store$: Store<AppState>,
    private scenesService: ScenesService,
    private notificationService: NotificationService,
    ) { }

  ngOnInit(): void {
    this.handleNameErrors();

    if (this.processName) {
      this.subs.add(
        this.store$.select(hyp3Store.getProcessingProjectName).subscribe(name => {
          this.projectName = name;
        })
      );
    } else {
      this.subs.add(
        this.store$.select(filtersStore.getProjectName).subscribe(name => {
          this.projectName = name;
        })
      );
    }

    this.subs.add(
      combineLatest([
        this.scenesService.scenes$,
        this.store$.select(hyp3Store.getHyp3User).pipe(
          tap(user => {
            if (user === null) {
              this.store$.dispatch(new hyp3Store.LoadUser());
            }
          })
        )
      ]).subscribe(([scenes, user]) => {
        if (user) {
          this.projectNames = [ ...user.job_names, ];
          if (this.filterValue) {
            this.filterProjectNames();
          } else {
            this.projectNamesFiltered = [ ...user.job_names, ];
          }
        }

        const projectNamesSet: Set<string> = scenes
        .filter(s => {
            return !!s?.metadata?.job?.name
        })
        .reduce(
          (names, s) => {
            names.add(s.metadata.job.name);
            return names;
          },
          new Set<string>(this.projectNames)
        );

        this.projectNames = [ ...Array.from(projectNamesSet) ];
      })
    );
  }

  public onPNameChange(pName: string) {
    this.onProjectNameChange(null, pName);
  }

  public onProjectNameChange(event: Event, pName?: string): void {
    let projectName = (pName) ? pName : (event.target as HTMLInputElement).value;
    if (projectName.length > this.maxProjectNameLength) {
      projectName = null;
      this.nameErrors$.next();
    }

    this.projectName = projectName;

    const action = (!this.processName) ?
      new filtersStore.SetProjectName(projectName === '' ? null : projectName) :
      new hyp3Store.SetProcessingProjectName(projectName);

    this.store$.dispatch(action);
  }

  public onProjectNameInput(event: Event): void {
    let projectName = (event.target as HTMLInputElement).value;
    let filterValue: string;
    if (projectName.length > this.maxProjectNameLength) {
      projectName = null;
      this.nameErrors$.next();
      filterValue = '';
    } else {
      filterValue = projectName.toLowerCase();
    }

    this.filterValue = filterValue;
    this.filterProjectNames();
  }

  private filterProjectNames() {
    this.projectNamesFiltered = this.projectNames.filter(
      option => option.toLowerCase().includes(this.filterValue)
    );
  }

  private handleNameErrors(): void {
    this.subs.add(
      this.nameErrors$.pipe(
        tap(_ => {
          this.notificationService.error(`Project Name too long. (over ${this.maxProjectNameLength} characters)`, 'Error', {
            timeOut: 5000
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
