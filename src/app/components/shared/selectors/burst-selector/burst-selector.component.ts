import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { sentinel_1 } from '@models/datasets';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';

@Component({
  selector: 'app-burst-selector',
  templateUrl: './burst-selector.component.html',
  styleUrls: ['./burst-selector.component.scss']
})
export class BurstSelectorComponent implements OnInit {
  @Output() toggled: EventEmitter<boolean> = new EventEmitter<boolean>(false)

  constructor(private store$: Store<AppState>) { }

  ngOnInit(): void {
  }

  public onToggleBurst(on: MatSlideToggleChange): void {
    if (on.checked) {
      this.store$.dispatch(new filtersStore.SetProductTypes([sentinel_1.productTypes.find(val => val.apiValue == 'BURST')]))
    } else {

      this.store$.dispatch(new filtersStore.SetProductTypes([]))
    }

    this.toggled.emit(on.checked)
  }

}
