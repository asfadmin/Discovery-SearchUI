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
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-job-product-name-selector',
  templateUrl: './job-product-name-selector.component.html',
  styleUrls: ['./job-product-name-selector.component.scss'],
  animations: [
    trigger('fadeTransition', [
      transition(':enter', [
        style({opacity: 0}),
        animate('100ms ease-in', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('100ms ease-out', style({opacity: 0}))
      ])
    ])
  ],
})
export class JobProductNameSelectorComponent implements OnInit, OnDestroy {
  @Input() headerView: boolean;
  public productNameFilter: string;
  private subs = new SubSink();
  public filteredOptionsList: string[];
  public unfilteredScenes: string[];

  public isJobFilterOptionsOpen = false;
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

    if(this.productNameFilter != null) {
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

  public autoSuggestionDisplay(suggestion: string) {
    const lastEntry = this.latestInput();
    if (lastEntry === '') {
      return (suggestion.slice(0, 15) + ' ... ' + suggestion.slice(suggestion.length - 4)).toUpperCase();
    }
    const idx = suggestion.indexOf(lastEntry);

    let bolded = idx !== -1 ? suggestion.slice(idx, idx + lastEntry.length) : '';
    bolded = '<strong><em>' + bolded + '</em></strong>';

    bolded = (idx < 15 ? suggestion.slice(0, Math.min(15, Math.max(idx, 0))) : '')
    + (idx >= 15 ? suggestion.slice(0, 15) +  ' ... ' : '')
    + (suggestion.length - 4 < idx ? suggestion.slice(suggestion.length - 4, idx) : '')
    + bolded
    + (idx < 15 && idx >= 0 ? suggestion.slice(idx + lastEntry.length, 15)
    + ( suggestion.length - 4 <= idx ? ' ... ' : '') : '')
    + (suggestion.length - 4 < idx ? suggestion.slice(idx + lastEntry.length) : '')
    + (suggestion.length - 4 > idx ? ' ... ' + suggestion.slice(suggestion.length - 4) : '')
    + (suggestion.length - 4 === idx ? suggestion.slice(suggestion.length - 4 + lastEntry.length) : '');

    return bolded.toUpperCase();
  }

  private latestInput(): string {
    const entries = this.productNameFilter.replace(/\s+/g, '').split(',');
    return entries[entries.length - 1].toLowerCase();
  }

  public toggleJobFilterOptions() {
    this.isJobFilterOptionsOpen = !this.isJobFilterOptionsOpen;
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
