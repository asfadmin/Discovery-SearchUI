import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SubSink } from 'subsink';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import * as filtersStore from '@store/filters';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

interface productMaturity {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-product-maturity-selector',
  templateUrl: './product-maturity-selector.component.html',
  styleUrl: './product-maturity-selector.component.scss',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    TranslateModule,
    MatTooltip,
  ],
})
export class ProductMaturitySelectorComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);

  productMaturityControl = new FormControl(['']);
  public selectedMaturity: string[] = [];

  maturities: productMaturity[] = [
    { value: 'P', viewValue: 'PROVISIONAL' },
    { value: 'X', viewValue: 'UNCALIBRATED' },
  ];

  private subs: SubSink = new SubSink();

  public ngOnInit(): void {
    this.subs.add(
      this.store$.select(filtersStore.getProductMaturity).subscribe((value) => {
        this.productMaturityControl.setValue(value);
      }),
    );
  }

  public onProductionMaturitySelect(value) {
    this.store$.dispatch(new filtersStore.setProductMaturity(value));
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
