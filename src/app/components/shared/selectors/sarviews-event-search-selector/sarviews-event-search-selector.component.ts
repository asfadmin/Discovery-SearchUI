import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sarviews-event-search-selector',
  templateUrl: './sarviews-event-search-selector.component.html',
  styleUrls: ['./sarviews-event-search-selector.component.scss']
})
export class SarviewsEventSearchSelectorComponent implements OnInit {
  @ViewChild('eventsQueryForm') public eventsQueryForm: NgForm;
  public eventQuery: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  // public onProjectNameChange(event: Event): void {
  //   let projectName = (event.target as HTMLInputElement).value;
  //   if (projectName.length > 20) {
  //     projectName = null;
  //     this.nameErrors$.next();
  //   }

  //   this.projectName = projectName;

  //   const action = (!this.processName) ?
  //     new filtersStore.SetProjectName(projectName === '' ? null : projectName) :
  //     new hyp3Store.SetProcessingProjectName(projectName);

  //   this.store$.dispatch(action);
  // }

  public onSearchQueryChange(event: Event): void {
    let query = (event.target as HTMLInputElement).value;
    console.log(query);

  }
}
