import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {SharedModule} from '@shared';
import { SubSink } from 'subsink';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';

interface sciProd {
  value: string;
  viewValue: string;
}

interface sciProdGroup {
  disabled?: boolean;
  name: string;
  sciProd: sciProd[];
}

@Component({
  selector: 'app-product-science-selector',
  standalone: true,
  templateUrl: './product-science-selector.component.html',
  styleUrl: './product-science-selector.component.scss',
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatInputModule, SharedModule],
})
export class ProductScienceSelectorComponent implements OnInit, OnDestroy {
  sciProdControl: FormControl<string[]> = new FormControl([]);
  sciProdGroups: sciProdGroup[] = [

    {
      name: 'Level-3',
      disabled: false,
      sciProd: [
        {value: 'SME2', viewValue: 'SME2 (Soil Moisture EASE-Grid 2.0)'},
      ],
    },

    {
      name: 'Level-2',
      disabled: false,
      sciProd: [
        {value: 'GSLC', viewValue: 'GSLC (Geocoded Single Look Complex)'},
        {value: 'GCOV', viewValue: 'GCOV (Geocoded Polarimetric Covariance)'},
        {value: 'GUNW', viewValue: 'GUNW (Geocoded Unwrapped Interferogram)'},
        {value: 'GOFF', viewValue: 'GOFF (Geocoded Pixel Offsets)'},
      ],
    },

    {
      name: 'Level-1',
      disabled: false,
      sciProd: [
        {value: 'RSLC', viewValue: 'RSLC (Range-Doppler Single Look Complex)'},
        {value: 'RIFG', viewValue: 'RIFG (Range-Doppler Wrapped Interferogram)'},
        {value: 'RUNW', viewValue: 'RUNW (Range-Doppler Unwrapped Interferogram)'},
        {value: 'ROFF', viewValue: 'ROFF (Range-Doppler Pixel Offsets)'},
      ],
    },

    {
      name: 'Level-0',
      sciProd: [
        {value: 'L0B', viewValue: 'L0B (Radar Raw Signal Data)'},
      ],
    },

  ];
  private subs: SubSink = new SubSink();

  public constructor(private store$: Store<AppState>) {}

  public ngOnInit(): void {
    this.subs.add(this.store$.select(filtersStore.getScienceProduct).subscribe(value => {
      this.sciProdControl.setValue(value);
    }))
  }
  public onSciProductSelect(value) {
    this.store$.dispatch(new filtersStore.setScienceProduct(value));
  }
  public ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}
