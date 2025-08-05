import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {SharedModule} from '@shared';
import { SubSink } from 'subsink';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import * as filtersStore from '@store/filters';
import {MatTooltip} from '@angular/material/tooltip';

interface prodConfig {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-production-config-selector',
  standalone: true,
  templateUrl: './production-config-selector.component.html',
  styleUrl: './production-config-selector.component.scss',
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatInputModule, SharedModule, MatTooltip],
})

export class ProductionConfigSelectorComponent implements OnInit, OnDestroy {
  prodConfigControl = new FormControl(['']);
  public selectedConfig: string[] = ['PR']; // Default selected config

  prodConfigs: prodConfig[] = [
    {value: 'PR', viewValue: 'PRODUCTION'},
    {value: 'UR', viewValue: 'URGENT_RESPONSE'},
    {value: 'OD', viewValue: 'CUSTOM_VALIDATION'},
  ];


  private subs: SubSink = new SubSink();

  public constructor(private store$: Store<AppState>) {}

  public ngOnInit(): void {
    this.onProductionConfigSelect(this.selectedConfig);

    this.subs.add(this.store$.select(filtersStore.getProductionConfig).subscribe(value => {
      this.prodConfigControl.setValue(value);
    }))
  }

  public onProductionConfigSelect(value) {
    this.store$.dispatch(new filtersStore.setProductionConfig(value));
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}
