import { Component, OnInit, inject } from '@angular/core';
import { SharedModule } from '@shared';
import { beta } from '@models';
import * as filtersStore from '@store/filters';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-baseline-frame-reference-toggle',
  imports: [CommonModule, SharedModule, MatSlideToggleModule, FormsModule],
  templateUrl: './baseline-frame-reference-toggle.component.html',
  styleUrl: './baseline-frame-reference-toggle.component.scss',
})
export class BaselineFrameReferenceToggleComponent implements OnInit {
  private store$ = inject<Store<AppState>>(Store);

  public datasets = [beta];
  public selectedDataset = 'SENTINEL-1 INTERFEROGRAM (BETA)';
  public shouldUseFramesForReference = false;

  ngOnInit(): void {
    this.store$
      .select(filtersStore.getShouldUseFramesForReference)
      .subscribe(
        (usingReference) => (this.shouldUseFramesForReference = usingReference),
      );
  }
  public onFrameModeToggled() {
    this.store$.dispatch(
      new filtersStore.SetUseFrameForBaseline(this.shouldUseFramesForReference),
    );
  }
}
