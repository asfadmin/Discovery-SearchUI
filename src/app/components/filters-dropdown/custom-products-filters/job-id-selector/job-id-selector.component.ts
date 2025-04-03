import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationService } from '@services';

@Component({
  selector: 'app-job-id-selector',
  templateUrl: './job-id-selector.component.html',
  styleUrl: './job-id-selector.component.scss'
})
export class JobIdSelectorComponent {
  @Input() jobId: string;
  @Output() newJobId = new EventEmitter<string>;

  constructor(private notification: NotificationService) {}

  onJobIdChange(event: Event) {
    const jobIdInput = (event.target as HTMLInputElement).value;
    const jobId = this.findJobId(jobIdInput);

    if (jobId === null) {
      this.notification.info('Invalid Job Id');
      this.newJobId.emit('');
      return;
    } else {
      this.newJobId.emit(jobId);
    }

  }

  private findJobId(inputStr: string) {
    const regex = /[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}/i;
    const matches = inputStr.match(regex);

    if (matches?.length > 0) {
      return matches[0];
    } else {
      return null;
    }
  }
}
