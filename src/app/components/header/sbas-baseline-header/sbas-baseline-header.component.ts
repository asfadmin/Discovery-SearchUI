import { Component } from '@angular/core';

import { SearchTypeSelectorComponent } from '@components/shared/selectors/search-type-selector/search-type-selector.component';
import { SearchButtonComponent } from '@components/shared/search-button/search-button.component';
import { HeaderButtonsComponent } from '../header-buttons/header-buttons.component';

@Component({
  selector: 'app-sbas-baseline-header',
  imports: [
    SearchTypeSelectorComponent,
    SearchButtonComponent,
    HeaderButtonsComponent,
  ],
  templateUrl: './sbas-baseline-header.component.html',
  styleUrls: [
    './sbas-baseline-header.component.scss',
    '../header.component.scss',
  ],
})
export class SbasBaselineHeaderComponent {}
