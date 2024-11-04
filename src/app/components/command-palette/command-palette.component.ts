import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete'; 
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import { SubSink } from 'subsink';
import { Action } from '@ngrx/store';
import * as searchStore from '@store/search';
import * as queueStore from '@store/queue';
import * as models from '@models';
import { map, Observable, startWith } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Hyp3Service, ScenesService, ThemingService } from '@services';

interface CommandOption {
  display: string,
  action?: (any?) => (Action[] | Action | undefined),
  value?: any,
  sideEffect?: CallableFunction
  // subOptions?: CommandSubOption[]
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatAutocompleteModule, ReactiveFormsModule, CommonModule, MatMenuModule],
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.scss'
})
export class CommandPaletteComponent implements OnInit, OnDestroy {
  @Output() public commandSelected = new EventEmitter<void>();
  @ViewChild('commandPaletteField') commandPaletteField: ElementRef;
  myControl = new FormControl('');
  private searchType: models.SearchType
  private products$ = this.scenesService.products$();

  filteredOptions: Observable<CommandOption[]>;
  private products: models.CMRProduct[] = []
  private subs = new SubSink();
  constructor(
    private store$: Store<AppState>,
    private scenesService: ScenesService,
    private themeService: ThemingService,
    private hyp3: Hyp3Service
  ) {
  }

  private _setSearchType = (searchType: models.SearchType) => {
    return new searchStore.SetSearchType(searchType)
  }

  selectedCommand: string = ""
  public defaultCommands: CommandOption[] = [
    {
      display: "SEARCH: switch search to geographic",
      action: this._setSearchType,
      value: models.SearchType.DATASET
    },
    {
      display: "SEARCH: switch search to List",
      action: this._setSearchType,
      value: models.SearchType.LIST
    },
    {
      display: "SEARCH: switch search to baseline",
      action: this._setSearchType,
      value: models.SearchType.BASELINE
    },
    {
      display: "SEARCH: switch search type to SBAS",
      action: this._setSearchType,
      value: models.SearchType.SBAS
    },
    {
      display: "SEARCH: switch search to on demand",
      action: this._setSearchType,
      value: models.SearchType.CUSTOM_PRODUCTS
    },
    {
      display: "SEARCH: switch search to event",
      action: this._setSearchType,
      value: models.SearchType.SARVIEWS_EVENTS
    },
    {
      display: "SEARCH: clear search",
      action: () => new searchStore.ClearSearch(),
      value: null
    },
    {
      display: "DOWNLOADS: add all results to download queue",
      action: () => this.queueAllProducts(this.get_products()),
    },
    {
      display: "DOWNLOADS: clear download queue",
      action: this.clearDownloadQueue,
    },
    {
      display: "THEME: set dark theme",
      sideEffect: () => this.themeService.setTheme('theme-dark')
    },
    {
      display: "THEME: set light theme",
      sideEffect: () => this.themeService.setTheme('theme-light')
    }
  ]

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
      map(value => value.sort((a, b) => {
        if (a.display.toLowerCase() < b.display.toLowerCase()) {
          return -1
        }
        return 1
      }))
    );
    this.subs.add(this.products$.subscribe(products =>
      this.products = products
    )
  );
  this.subs.add(
    this.store$.select(searchStore.getSearchType).subscribe(
      searchType => this.searchType = searchType
    )
    // this.store$.select(this.sceneStore)
  )
  }
  ngAfterViewInit() {
    this.commandPaletteField.nativeElement.focus();
    // this.cd.detectChanges();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  public selectionMade(selected: MatAutocompleteSelectedEvent) {
    const command = this.defaultCommands.find(f => f.display === selected.option.value)
    // const command: CommandOption = selected.option.value
    if (!!command.action) {
      if (command.action instanceof Array) {
        for (const sub_action of command.action) {
          this.store$.dispatch(sub_action)
        }
      }
      else {
        if (!!command.value) {
          this.store$.dispatch(command.action(command.value) as Action)
        } else {
          this.store$.dispatch(command.action() as Action)
        }
      }
  }

  if(!!command.sideEffect) {
    command.sideEffect()
  }

  this.commandSelected.emit()
  }

  private _filter(value: string): CommandOption[] {
    const filterValue = value.toLowerCase();

    return this.defaultCommands.filter(option => option.display.toLowerCase().includes(filterValue));
  }

  private queueAllProducts(products: models.CMRProduct[]): queueStore.AddItems {
    // let products = this.get_products()
    if (this.searchType === models.SearchType.CUSTOM_PRODUCTS) {
      products = this.hyp3.downloadable(this.products);
    }

    return new queueStore.AddItems(products);
  }

  // private setTheme(theme: string) {
    // this.themeService.setTheme(theme)
  // }

  private clearDownloadQueue() {
    return new queueStore.ClearQueue();
  }

  private get_products() {
    return this.products
  }
}
