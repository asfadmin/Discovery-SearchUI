import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { sentinel_1 } from '@models/datasets';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import { first, map } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-burst-selector',
  templateUrl: './burst-selector.component.html',
  styleUrls: ['./burst-selector.component.scss']
})
export class BurstSelectorComponent implements OnInit {
  @Output() toggled: EventEmitter<boolean> = new EventEmitter<boolean>(false)
  private subs: SubSink = new SubSink()
  constructor(private store$: Store<AppState>) {

  }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(filtersStore.getProductTypes).pipe(
        first(),
        map(datasetTypes => datasetTypes.map(p => p.apiValue).includes('BURST'))
      ).subscribe( on => this.toggled.emit(on))
    )
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
