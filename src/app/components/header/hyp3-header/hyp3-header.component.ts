import { Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as hyp3Store from '@store/hyp3';

import * as models from '@models';
import * as services from '@services';

@Component({
  selector: 'app-hyp3-header',
  templateUrl: './hyp3-header.component.html',
  styleUrls: ['./hyp3-header.component.scss', '../header.component.scss'],
  standalone: false,
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
