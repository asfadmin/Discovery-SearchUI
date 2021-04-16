import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { SubSink } from 'subsink';

import * as filtersStore from '@store/filters';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ScenesService } from '@services';
import { getScenes } from '@store/scenes';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-job-product-name-selector',
  templateUrl: './job-product-name-selector.component.html',
  styleUrls: ['./job-product-name-selector.component.scss']
})
export class JobProductNameSelectorComponent implements OnInit, OnDestroy {
  @Input() headerView: boolean;
  public productNameFilter: string;
  private subs = new SubSink();
  public filteredOptionsList: string[];
  public unfilteredScenes: string[];

  public myControl = new FormControl();

  constructor(
    private store$: Store<AppState>,
    private scenesService: ScenesService,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(filtersStore.getProductNameFilter).subscribe(
        productNameFilter => this.productNameFilter = productNameFilter
      )
    );

    const fileNames = this.scenesService.scenes$().pipe(
      map(scenes =>
          scenes.map(scene => scene.metadata.fileName.toLowerCase().split('.')[0])
      )
    );

    this.subs.add(
      this.store$.select(getScenes).subscribe(
        res => this.unfilteredScenes = res.map(scene => scene.metadata.fileName.toLowerCase().split('.')[0])
      )
    );

    this.subs.add(
      combineLatest([this.myControl.valueChanges, fileNames]).pipe(
        map(([_, filteredRes]) => filteredRes)
      ).subscribe(res => {
          if (this.productNameFilter != null) {
            const temp = this.productNameFilter.replace(/\s+/g, '').endsWith(',')
              ? this.unfilteredScenes.filter(scene => !res.includes(scene)) : res;
            this.filteredOptionsList = temp.filter(file => this.autoSuggestion(file.toLowerCase()));
          } else {
            this.filteredOptionsList = this.unfilteredScenes;
          }
        }
      )
    );
  }

  public onFilterProductName(productName: string): void {
    const action = new filtersStore.SetProductNameFilter(productName);
    this.store$.dispatch(action);
  }

  public autoCompleteEntry(suggestion: string) {
    let output = '';

    if (this.productNameFilter != null) {
    if (this.productNameFilter.split(',').length > 1) {
      if (this.productNameFilter.replace(/\s+/g, '').endsWith(',')) {
        output = this.productNameFilter + suggestion;
      } else {
        const fields = this.productNameFilter.split(',');
        fields[fields.length - 1] = suggestion;
        output = fields.join(', ');
      }
    } else {
      output = suggestion;
    }
  }
    return output;
  }

  public autoSuggestion(suggestion: string) {
    if (this.productNameFilter == null) {
      return suggestion;
    }
    if (this.productNameFilter.split(',').length > 1) {
      const filenames = this.productNameFilter.replace(/\s+/g, '').toLowerCase();
      if (filenames.endsWith(',')) {
        return filenames.includes(suggestion) ? '' : suggestion;
      } else {
        const filenamesList = filenames.split(',');
        const lastEntry = filenamesList[filenamesList.length - 1];
        return suggestion.includes(lastEntry) ? suggestion : '';
      }
    }
    return suggestion.includes(this.productNameFilter) ? suggestion : '';
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
