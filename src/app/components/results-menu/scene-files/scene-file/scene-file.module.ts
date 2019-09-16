import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSharedModule } from '@shared';
import { CopyToClipboardModule } from '@components/shared/copy-to-clipboard';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { PipesModule } from '@pipes';

import { SceneFileComponent } from './scene-file.component';


@NgModule({
  declarations: [SceneFileComponent],
  imports: [
    CommonModule,
    MatSharedModule,
    CopyToClipboardModule,
    TruncateModule,
    PipesModule,
  ],
  exports: [
    SceneFileComponent
  ]
})
export class SceneFileModule { }
