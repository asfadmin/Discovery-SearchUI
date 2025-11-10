import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';

import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faSpinner, fas } from '@fortawesome/free-solid-svg-icons';

import { Hyp3JobStatusBadgeModule } from '@components/shared/hyp3-job-status-badge';

import { CartToggleModule } from '@components/shared/cart-toggle';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { SceneFileComponent } from './scene-file.component';
import { DownloadFileButtonModule } from '@components/shared/download-file-button/download-file-button.module';
import { SharedModule } from '@shared';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatMenuModule,
    MatChipsModule,
    Hyp3JobStatusBadgeModule,
    CartToggleModule,
    TruncateModule,
    DownloadFileButtonModule,
    SharedModule,
    SceneFileComponent,
  ],
  exports: [SceneFileComponent],
})
export class SceneFileModule {
  constructor() {
    const library = inject(FaIconLibrary);

    library.addIconPacks(fas);
    library.addIcons(faSpinner);
  }
}
