import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import * as models from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { getHyp3ProductTypes, SetHyp3ProductTypes } from '@store/filters';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-hyp3-job-type-selector',
  templateUrl: './hyp3-job-type-selector.component.html',
  styleUrls: ['./hyp3-job-type-selector.component.scss']
})
export class Hyp3JobTypeSelectorComponent implements OnInit {
  public hyp3JobTypes = Object.keys(models.hyp3JobTypes);
  public selected: string[] = [];

  public subs = new SubSink();

  constructor(public store$: Store<AppState>) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(getHyp3ProductTypes).subscribe(
        selected => this.selected = selected.map(prodType => prodType.id)
      )
    )
  }

  onSelect(checkboxChange: MatCheckboxChange, jobType: string) {
    console.log(checkboxChange.checked);

    let checked = this.selected;
    if(checkboxChange.checked) {
      checked.push(jobType);
    } else {
      checked = this.selected.filter(job => job !== jobType);
    }
    this.store$.dispatch(new SetHyp3ProductTypes(checked))
    // if(checkboxChange.checked) {
    //   this.selected.push(jobType);
    // } else {
    //   this.selected.
    // }
  }
}
