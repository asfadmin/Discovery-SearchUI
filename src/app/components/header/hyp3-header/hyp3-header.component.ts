import { Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as hyp3Store from '@store/hyp3';

import * as models from '@models';
import * as services from '@services';
import { SearchTypeSelectorComponent } from '../../shared/selectors/search-type-selector/search-type-selector.component';
import { ProjectNameSelectorComponent } from '../../shared/selectors/project-name-selector/project-name-selector.component';
import { DateSelectorComponent } from '../../shared/selectors/date-selector/date-selector.component';
import { JobStatusSelectorComponent } from '../../shared/selectors/job-status-selector/job-status-selector.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SearchButtonComponent } from '../../shared/search-button/search-button.component';
import { HeaderButtonsComponent } from '../header-buttons/header-buttons.component';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hyp3-header',
  templateUrl: './hyp3-header.component.html',
  styleUrls: ['./hyp3-header.component.scss', '../header.component.scss'],
  imports: [
    SearchTypeSelectorComponent,
    ProjectNameSelectorComponent,
    DateSelectorComponent,
    JobStatusSelectorComponent,
    MatButton,
    MatIcon,
    SearchButtonComponent,
    HeaderButtonsComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class Hyp3HeaderComponent {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(services.ScreenSizeService);

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.OpenFiltersMenu());
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }

  public onRefreshJobs(): void {
    this.store$.dispatch(new hyp3Store.LoadJobs());
  }

  public closeAOIOptions(): void {
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }
}
