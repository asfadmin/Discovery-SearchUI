import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSpinner, fas } from '@fortawesome/free-solid-svg-icons';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';

import { MatSharedModule } from '@shared';
import { PipesModule } from '@pipes';
import { ProcessingQueueComponent } from './processing-queue.component';
import { ProcessingQueueJobsModule } from './processing-queue-jobs';
import { ProcessingOptionsModule } from './processing-options';
import { MatDialogModule } from '@angular/material/dialog';
import { QueueSubmitComponent } from './queue-submit/queue-submit.component';
import { ResizableModule } from 'angular-resizable-element';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProjectNameSelectorModule } from '@components/shared/selectors/project-name-selector';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { AngularResizeEventModule } from 'angular-resize-event';
import { CreateSubscriptionModule } from '../../header/create-subscription';
import {DocsModalModule} from '@components/shared/docs-modal';
import {Hyp3UrlModule} from '@components/shared/hyp3-url/hyp3-url.module';
import { SharedModule } from '@shared';



@NgModule({
  declarations: [
    ProcessingQueueComponent,
    QueueSubmitComponent,
    ConfirmationComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        FontAwesomeModule,
        MatSharedModule,
        MatInputModule,
        MatChipsModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatBottomSheetModule,
        PipesModule,
        ProjectNameSelectorModule,
        ProcessingQueueJobsModule,
        ProcessingOptionsModule,
        MatDialogModule,
        ResizableModule,
        AngularResizeEventModule,
        DragDropModule,
        MatTabsModule,
        MatMenuModule,
        ScrollingModule,
        CreateSubscriptionModule,
        DocsModalModule,
        Hyp3UrlModule,
        SharedModule
    ]
})
export class ProcessingQueueModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    library.addIcons(faSpinner);
  }
}
