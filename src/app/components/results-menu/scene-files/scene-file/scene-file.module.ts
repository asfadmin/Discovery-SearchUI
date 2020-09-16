import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSpinner, fas } from '@fortawesome/free-solid-svg-icons';
import { MatSharedModule } from '@shared';
import { CopyToClipboardModule } from '@components/shared/copy-to-clipboard';
import { CartToggleModule } from '@components/shared/cart-toggle';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { PipesModule } from '@pipes';

import { SceneFileComponent } from './scene-file.component';


@NgModule({
  declarations: [SceneFileComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatSharedModule,
    MatMenuModule,
    MatChipsModule,
    CopyToClipboardModule,
    CartToggleModule,
    TruncateModule,
    PipesModule,
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
