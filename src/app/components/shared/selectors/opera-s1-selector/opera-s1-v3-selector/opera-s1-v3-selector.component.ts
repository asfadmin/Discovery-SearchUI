import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filterStore from '@store/filters'
import { SubSink } from 'subsink';

@Component({
  selector: 'app-opera-s1-v3-selector',
  templateUrl: './opera-s1-v3-selector.component.html',
  styleUrl: './opera-s1-v3-selector.component.scss'
})
export class OperaS1V3SelectorComponent implements OnInit {
  private subs = new SubSink();
  public v3Only = false;
  
  constructor(private store$: Store<AppState>) {

  }

  ngOnInit(): void {
    this.subs.add(this.store$.select(filterStore.getOperaV3Only).subscribe(
      val => this.v3Only = val
    ))
  }
  public onToggleV3(value: MatSlideToggleChange) {
    this.store$.dispatch(new filterStore.setOperaV3Only(value.checked));
  }
}
