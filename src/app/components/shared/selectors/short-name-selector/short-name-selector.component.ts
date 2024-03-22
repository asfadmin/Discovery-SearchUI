import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as models from '@models';
import * as filtersStore from '@store/filters';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SubSink } from 'subsink';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-short-name-selector',
  templateUrl: './short-name-selector.component.html',
  styleUrl: './short-name-selector.component.scss'
})
export class ShortNameSelectorComponent implements OnInit, OnDestroy {
  @Output() shortNamesChange = new EventEmitter<models.DatasetShortName>();
  public dataset: models.Dataset;
  public shortNamesList: string[] = [];
  public selectableShortNames: models.ShortName[] = []

  private dataset$ = this.store$.select(filtersStore.getSelectedDataset);


  constructor(private store$: Store<AppState>) { }

  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.dataset$.subscribe(
        dataset => {
          this.dataset = dataset
          this.selectableShortNames = dataset?.shortNames ?? []
        }
      )
    )
    this.subs.add(
      this.store$.select(filtersStore.getShortNames).subscribe(
        shortNamesList => this.shortNamesList = shortNamesList.map(val => val.apiValue)
      )
    )
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public onNewShortNames(event: MatSelectChange): void {
    const shortNameAPIValues = (event.value as string[]);
    this.emitShortNames(shortNameAPIValues);
  }

  public emitShortNames(shortNameAPIValues: string[]): void {
    const shortNames = this.dataset?.shortNames ?? []
    let output = shortNameAPIValues.map(shortName => shortNames.find(datasetType => datasetType.apiValue === shortName))
    this.shortNamesChange.emit(output);
  }
}



