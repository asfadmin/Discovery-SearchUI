import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { MatFormField, MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

import { NotificationService } from '@services';

@Component({
  selector: 'app-job-id-selector',
  templateUrl: './job-id-selector.component.html',
  styleUrl: './job-id-selector.component.scss',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    CdkTextareaAutosize,
    FormsModule,
    TranslateModule,
  ],
})
export class JobIdSelectorComponent {
  private notification = inject(NotificationService);

  @Input() jobIds: string[];
  @Output() newJobIds = new EventEmitter<string[]>();

  onJobIdsChange(event: Event) {
    const jobIdsInput = (event.target as HTMLInputElement).value;
    const jobIds = [...new Set(this.findJobIds(jobIdsInput))];

    if (jobIds.length < 1) {
      this.notification.info('Invalid Job Ids');
      this.newJobIds.emit([]);
      return;
    } else {
      this.newJobIds.emit(jobIds);
    }
  }

  private findJobIds(inputStr: string) {
    const jobIdRegex =
      /[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}/g;
    const matches = inputStr.match(jobIdRegex);

    return matches;
  }
}
