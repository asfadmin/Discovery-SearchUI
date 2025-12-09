import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SubSink } from 'subsink';
import * as filtersStore from '@store/filters';
import { SBASOverlap } from '@models';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sbas-overlap-selector',
  templateUrl: './sbas-overlap-selector.component.html',
  styleUrls: ['./sbas-overlap-selector.component.scss'],
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    FormsModule,
    MatOption,
    UpperCasePipe,
    TranslateModule,
  ],
})
export class SbasOverlapSelectorComponent implements OnInit {
  private store$ = inject<Store<AppState>>(Store);

  public fiftyPercentOverlapToggled = false;
  public SBASOverlapThreshold: SBASOverlap = SBASOverlap.ALL;
  public SBASOverlapTypes = SBASOverlap;
  private subs = new SubSink();

  public overlapTypes = Object.keys(SBASOverlap);

  ngOnInit(): void {
    this.subs.add(
      this.store$
        .select(filtersStore.getSBASOverlapToggle)
        .subscribe(
          (toggledOn) => (this.fiftyPercentOverlapToggled = toggledOn),
        ),
    );
    this.subs.add(
      this.store$
        .select(filtersStore.getSBASOverlapThreshold)
        .subscribe((threshold) => (this.SBASOverlapThreshold = threshold)),
    );
  }

  public onChange(): void {
    this.store$.dispatch(new filtersStore.Toggle50PercentOverlap());
  }

  public onSetThreshold(value): void {
    this.store$.dispatch(new filtersStore.SetSBASOverlapThreshold(value));
  }
}
