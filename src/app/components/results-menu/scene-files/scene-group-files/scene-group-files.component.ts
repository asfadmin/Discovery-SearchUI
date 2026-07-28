import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() productsByGroup: Record<string, models.CMRProduct[]> | null = null;
  @Input() groups: string[] | null = null;
  @Input() queuedProductIds: Set<string> | null = null;
  @Input() validJobTypesByProduct: Record<string, models.Hyp3JobType[]> = {};
  @Input() showRelatedData = false;
  @Input() subqueryProducts$: Observable<models.CMRProduct[]>;
  @Input() subqueryLoaded = false;

  @Output() toggleProduct = new EventEmitter<models.CMRProduct>();
  @Output() queueHyp3Job = new EventEmitter<models.QueuedHyp3Job>();
}
