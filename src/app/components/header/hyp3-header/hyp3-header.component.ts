import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { SearchButtonComponent } from '@components/shared/search-button/search-button.component';
import { DateSelectorComponent } from '@components/shared/selectors/date-selector/date-selector.component';
import { JobStatusSelectorComponent } from '@components/shared/selectors/job-status-selector/job-status-selector.component';
import { ProjectNameSelectorComponent } from '@components/shared/selectors/project-name-selector/project-name-selector.component';
import { SearchTypeSelectorComponent } from '@components/shared/selectors/search-type-selector/search-type-selector.component';
import * as models from '@models';
import * as services from '@services';
import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';
import * as uiStore from '@store/ui';

import { HeaderButtonsComponent } from '../header-buttons/header-buttons.component';

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
