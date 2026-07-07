import { Component } from '@angular/core';

import { SearchTypeSelectorComponent } from '@components/shared/selectors/search-type-selector/search-type-selector.component';
import { SearchButtonComponent } from '@components/shared/search-button/search-button.component';
import { HeaderButtonsComponent } from '../header-buttons/header-buttons.component';

import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';

import * as models from '@models';

@Component({
  selector: 'app-sbas-baseline-header',
  imports: [
    SearchTypeSelectorComponent,
    SearchButtonComponent,
    HeaderButtonsComponent,
    MatSelectModule,
    TranslateModule,
  ],
  templateUrl: './sbas-baseline-header.component.html',
  styleUrls: [
    './sbas-baseline-header.component.scss',
    '../header.component.scss',
  ],
})
export class SbasBaselineHeaderComponent {
  datasets = [
    {
      name: models.sentinel_1.name,
      id: models.sentinel_1.id,
    },
    {
      name: models.sentinel_1_bursts.name,
      id: models.sentinel_1_bursts.id,
    },
    {
      name: 'S1 Multiburst',
      id: 'S1-MULTIBURST',
    },
    {
      name: models.beta.name,
      id: models.beta.id,
    },
  ];
}
