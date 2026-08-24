import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import * as filtersStore from '@store/filters';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

interface prodConfig {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-production-config-selector',
  templateUrl: './production-config-selector.component.html',
  styleUrl: './production-config-selector.component.scss',
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
export class ProductionConfigSelectorComponent {
  private store$ = inject<Store<AppState>>(Store);

  protected readonly selectedConfig = this.store$.selectSignal(
    filtersStore.getProductionConfig,
  );

  protected readonly prodConfigs: prodConfig[] = [
    { value: 'PR', viewValue: 'PRODUCTION' },
    { value: 'UR', viewValue: 'URGENT_RESPONSE' },
    { value: 'OD', viewValue: 'CUSTOM_VALIDATION' },
  ];

  protected onProductionConfigSelect(value: string[]): void {
    this.store$.dispatch(new filtersStore.setProductionConfig(value));
  }
}
