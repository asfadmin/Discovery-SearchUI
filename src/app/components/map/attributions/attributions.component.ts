import { Component, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { MaxResultsSelectorComponent } from '@components/shared/max-results-selector/max-results-selector.component';
import { SearchButtonComponent } from '@components/shared/search-button/search-button.component';
import { Breakpoints, asfWebsite } from '@models';
import { AppState } from '@store';
import * as uiStore from '@store/ui';

@Component({
  selector: 'app-attributions',
  templateUrl: './attributions.component.html',
  styleUrls: ['./attributions.component.scss'],
  imports: [
    MaxResultsSelectorComponent,
    SearchButtonComponent,
    TranslateModule,
  ],
})
export class AttributionsComponent {
  private store$ = inject<Store<AppState>>(Store);

  @Input() breakpoint: Breakpoints;

  anio: number = new Date().getFullYear();

  public breakpoints = Breakpoints;
  public asfWebsite = asfWebsite;

  public onToggleMenu(): void {
    this.store$.dispatch(new uiStore.ToggleResultsMenu());
  }
}
