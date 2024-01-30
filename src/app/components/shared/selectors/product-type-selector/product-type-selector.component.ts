import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import * as models from '@models';
import * as filtersStore from '@store/filters';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SubSink } from 'subsink';
import { MatSelectChange } from '@angular/material/select';
import { combineLatest } from 'rxjs';


@Component({
  selector: 'app-product-type-selector',
  templateUrl: './product-type-selector.component.html',
  styleUrls: ['./product-type-selector.component.css']
})
export class ProductTypeSelectorComponent implements OnInit, OnDestroy {
  @Input() burstSelected: boolean = false;
  @Output() typesChange = new EventEmitter<models.DatasetProductTypes>();
  public dataset: models.Dataset;
  public productTypesList: string[] = [];
  public selectableProductTypes: models.ProductType[] = []

  private datasetProductTypes$ = this.store$.select(filtersStore.getProductTypes);
  private useCalibrationData$ = this.store$.select(filtersStore.getUseCalibrationData);
  private dataset$ = this.store$.select(filtersStore.getSelectedDataset);
  
  
  constructor(private store$: Store<AppState>) { }

  private subs = new SubSink();
  
  ngOnInit(): void {
    this.subs.add(
      this.dataset$.subscribe(
        dataset => this.dataset = dataset
      ) 
    )
    this.subs.add(
      this.datasetProductTypes$.subscribe(types => this.productTypesList = types.map(type => type.apiValue).filter(v => v !== 'BURST'))
    );
    this.subs.add(
      this.store$.select(filtersStore.getUseCalibrationData).subscribe(useCalibrationData => {
        if (useCalibrationData) {
          this.productTypesList = this.productTypesList.filter(productType => this.dataset.calibrationProductTypes
            .map(calibrationTypes => calibrationTypes.apiValue)
            .includes(productType))

            this.emitProductTypes(this.productTypesList);
        }
      })
    );
    this.subs.add(
      combineLatest([this.useCalibrationData$, this.dataset$]).subscribe(
        ([useCalibration, dataset]) => {
          if(useCalibration) {
            this.selectableProductTypes = dataset.calibrationProductTypes ?? dataset.productTypes
          } else {
            this.selectableProductTypes = dataset.productTypes
          }
        }
      )
    )
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public onNewProductTypes(event: MatSelectChange): void {
    const productTypesAPIValues = (event.value as string[]);
    this.emitProductTypes(productTypesAPIValues);
  }

  public emitProductTypes(productTypesAPIValues: string[]): void {
    const productTypes = productTypesAPIValues.map(
        val => this.dataset.productTypes.find(datasetType => datasetType.apiValue === val)
      ).filter(val => !!val);

    this.typesChange.emit(productTypes);
  }
}
