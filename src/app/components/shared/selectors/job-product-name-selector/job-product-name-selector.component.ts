import { Component, OnInit, OnDestroy, Input, EventEmitter } from '@angular/core';
import { SubSink } from 'subsink';

import * as filtersStore from '@store/filters';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import { debounceTime, map } from 'rxjs/operators';
import { UntypedFormControl } from '@angular/forms';
import { ScenesService, ScreenSizeService } from '@services';
import { getScenes } from '@store/scenes';
import { combineLatest } from 'rxjs';
import { Breakpoints, menuAnimation } from '@models';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-job-product-name-selector',
  templateUrl: './job-product-name-selector.component.html',
  styleUrls: ['./job-product-name-selector.component.scss'],
  animations: menuAnimation,
})
export class JobProductNameSelectorComponent implements OnInit, OnDestroy {
  @Input() headerView: boolean;

  public productNameFilter = '';
  private subs = new SubSink();
  public filteredOptions: EventEmitter<string[]> = new EventEmitter<string[]>()
  public unfilteredScenes: string[];

  public isJobFilterOptionsOpen = false;
  public myControl = new UntypedFormControl();

  public breakpoints = Breakpoints;
  public breakpoint: Breakpoints;
  public screenWidth: number;

  constructor(
    private store$: Store<AppState>,
    private scenesService: ScenesService,
    private screenSize: ScreenSizeService,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(filtersStore.getProductNameFilter).subscribe(
        productNameFilter => this.productNameFilter = productNameFilter
      )
    );

    this.subs.add(
      this.screenSize.size$.subscribe(
        screenSize => this.screenWidth = screenSize.width
      )
    );

    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        val => this.breakpoint = val
      )
    );

    const fileNames = this.scenesService.scenes$.pipe(
      map(scenes => scenes
        .map(
            scene => {
              const filename = scene.metadata.fileName || '';
              return filename.toLowerCase().split('.')[0];
        })
      )
    );

    this.subs.add(
      this.store$.select(getScenes).subscribe(
        res => this.unfilteredScenes = Array.from(
          new Set(
            res
              .map(scene => {
                const filename = scene.metadata.fileName || '';
                return filename.toLowerCase().split('.')[0];
              })
          )
        )
      )
    );

    this.subs.add(
      combineLatest([this.myControl.valueChanges.pipe(
        debounceTime(200)
      ), fileNames]).pipe(
        map(([_, filteredRes]) => filteredRes)
      ).subscribe(res => {
          if (this.productNameFilter != null) {
            const temp = this.productNameFilter.replace(/\s+/g, '').endsWith(',')
              ? this.unfilteredScenes.filter(scene => !res.includes(scene)) : res;
            this.filteredOptions.emit(Array.from(new Set(temp.filter(file => this.autoSuggestion(file.toLowerCase())))));
          } else {
            this.filteredOptions.emit(this.unfilteredScenes);
          }
        }
      )
    );
  }

  public onSuggestionSelected(event: MatAutocompleteSelectedEvent): void {
    this.setProductNameFilter(event.option.value);
  }

  public onFilterProductName(event: Event): void {
    const productName = (event.target as HTMLInputElement).value;
    this.setProductNameFilter(productName);
  }

  private setProductNameFilter(productName: string) {
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

  public onCloseOptions() {
    this.isJobFilterOptionsOpen = false;
  }

  public onClearFilter() {
    this.setProductNameFilter('');
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
