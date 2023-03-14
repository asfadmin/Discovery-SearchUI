import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSpinner, fas } from '@fortawesome/free-solid-svg-icons';
import { MatSharedModule } from '@shared';
import { Hyp3JobStatusBadgeModule } from '@components/shared/hyp3-job-status-badge';
import { CopyToClipboardModule } from '@components/shared/copy-to-clipboard';
import { CartToggleModule } from '@components/shared/cart-toggle';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { PipesModule } from '@pipes';

import { SceneFileComponent } from './scene-file.component';
import {DownloadFileButtonModule} from '@components/shared/download-file-button/download-file-button.module';


@NgModule({
  declarations: [SceneFileComponent],
    imports: [
        CommonModule,
        FontAwesomeModule,
        MatSharedModule,
        MatMenuModule,
        MatChipsModule,
        CopyToClipboardModule,
        Hyp3JobStatusBadgeModule,
        CartToggleModule,
        TruncateModule,
        PipesModule,
        DownloadFileButtonModule,
    ],
  exports: [
    SceneFileComponent
  ]
})
export class SceneFileModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    library.addIcons(faSpinner);
  }
}
