import { Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';

import { ScreenSizeService } from '@services';
import { Breakpoints } from '@models';
import { SearchTypeSelectorComponent } from '../../shared/selectors/search-type-selector/search-type-selector.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SearchButtonComponent } from '../../shared/search-button/search-button.component';
import { HeaderButtonsComponent } from '../header-buttons/header-buttons.component';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-list-header',
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.css', '../header.component.scss'],
  imports: [
    SearchTypeSelectorComponent,
    MatButton,
    MatIcon,
    SearchButtonComponent,
    HeaderButtonsComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class ListHeaderComponent {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.OpenFiltersMenu());
  }
}
