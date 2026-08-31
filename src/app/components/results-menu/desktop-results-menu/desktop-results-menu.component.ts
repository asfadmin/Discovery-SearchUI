import { Component, OnInit, Input, OnDestroy, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import { ScenesService, ScreenSizeService } from '@services';
import { SubSink } from 'subsink';
import * as models from '@models';
import { MatCard, MatCardSubtitle } from '@angular/material/card';
import { NgClass, AsyncPipe, TitleCasePipe } from '@angular/common';
import { ScenesListHeaderComponent } from '../scenes-list-header/scenes-list-header.component';
import { ScenesListComponent } from '../scenes-list/scenes-list.component';
import { SceneDetailComponent } from '../scene-detail/scene-detail.component';
import { SceneFilesComponent } from '../scene-files/scene-files.component';
import { SceneSearchToolbarComponent } from '@components/results-menu/scene-search-toolbar/scene-search-toolbar.component';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-desktop-results-menu',
  templateUrl: './desktop-results-menu.component.html',
  styleUrls: [
    './desktop-results-menu.component.css',
    '../results-menu.component.scss',
  ],
  imports: [
    MatCard,
    NgClass,
    MatCardSubtitle,
    ScenesListHeaderComponent,
    ScenesListComponent,

    SceneDetailComponent,
    SceneFilesComponent,
    AsyncPipe,
    TitleCasePipe,
    TranslateModule,
    SceneSearchToolbarComponent,
  ],
})
export class DesktopResultsMenuComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);
  private scenesService = inject(ScenesService);

  @Input() resize$: Observable<void>;

  public selectedProducts$ = this.store$.select(
    scenesStore.getSelectedSceneProducts,
  );
  public scenesLength;
  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  private subs = new SubSink();

  ngOnInit() {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        (breakpoint) => (this.breakpoint = breakpoint),
      ),
    );
    this.subs.add(
      this.scenesService.scenes$.subscribe(
        (scenes) => (this.scenesLength = scenes.length),
      ),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
