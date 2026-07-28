import { Component, input, output } from '@angular/core';
import { Observable } from 'rxjs';

import * as models from '@models';

import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SceneGroupFileComponent } from '../scene-file/scene-group-file/scene-group-file.component';

@Component({
  selector: 'app-scene-group-files',
  templateUrl: './scene-group-files.component.html',
  styleUrls: ['./scene-group-files.component.scss'],
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatProgressSpinner,
    AsyncPipe,
    TranslateModule,
    SceneGroupFileComponent,
  ],
})
export class SceneGroupFilesComponent {
  productsByGroup = input<Record<string, models.CMRProduct[]> | null>(null);
  groups = input<string[] | null>(null);
  queuedProductIds = input<Set<string> | null>(null);
  validJobTypesByProduct = input<Record<string, models.Hyp3JobType[]>>({});
  showRelatedData = input(false);
  subqueryProducts$ = input<Observable<models.CMRProduct[]>>();
  subqueryLoaded = input(false);

  toggleProduct = output<models.CMRProduct>();
  queueHyp3Job = output<models.QueuedHyp3Job>();
}
