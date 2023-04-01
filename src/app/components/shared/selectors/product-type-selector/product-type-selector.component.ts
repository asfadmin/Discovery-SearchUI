import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import * as models from '@models';
import * as filtersStore from '@store/filters';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SubSink } from 'subsink';
import { MatSelectChange } from '@angular/material/select';


@Component({
  selector: 'app-product-type-selector',
  templateUrl: './product-type-selector.component.html',
  styleUrls: ['./product-type-selector.component.css']
})
export class ProductTypeSelectorComponent implements OnInit, OnDestroy {
  @Input() dataset: models.Dataset;
  @Input() burstSelected: boolean = false;
  @Output() typesChange = new EventEmitter<models.DatasetProductTypes>();

  public productTypesList: string[] = [];

  public datasetProductTypes$ = this.store$.select(filtersStore.getProductTypes);

  constructor(private store$: Store<AppState>) { }

  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.datasetProductTypes$.subscribe(types => this.productTypesList = types.map(type => type.apiValue).filter(v => v !== 'BURST'))
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public onNewProductTypes(event: MatSelectChange): void {
    const productTypesAPIValues = (event.value as string[]);
    const productTypes = productTypesAPIValues.map(
        val => this.dataset.productTypes.find(datasetType => datasetType.apiValue === val)
      ).filter(val => !!val);

    this.typesChange.emit(productTypes);
  }
}
