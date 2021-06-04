import { Injectable } from '@angular/core';

import { ActiveToast, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) {}

  // Custom toastr config example, toastClass styling in styles.scss
  private toastOptions = {
    // toastClass: 'pinkToast',
    // toastComponent: ToastrMessageComponent
  };

  public demandQueue(added: boolean = true, count: number = 0, job_type: string) {
    let headerText: string;
    let infoText = '';
    const action = added ? 'added to' : 'removed from';

    if (count > 1) {
      headerText = 'Jobs Added';
      infoText = `${count} ${job_type} jobs ${action} the On Demand Queue`;
      this.info(infoText, headerText);
    } else {
      infoText = `${job_type} job ${action} the On Demand Queue`;
      this.info(infoText);
    }
  }

  public jobsSubmitted(count: number) {
    const jobText = count > 1 ? `${count} jobs` : 'Job';

    this.info(`${jobText} processing`, 'Jobs Submitted');
  }

  public downloadQueue(added: boolean = true, count: number = 0) {
    let headerText: string;
    let infoText = '';
    const action = added ? 'added to' : 'removed from';

    if (count > 1) {
      headerText = 'Scenes Added';
      infoText = `${count} scenes ${action} the Download Queue`;
      this.info(infoText, headerText);
    } else {
      infoText = `Scene ${action} the Download Queue`;
      this.info(infoText);
    }
  }

  public clipboardSearchLink() {
    this.info('Search Link Copied');
  }

  public clipboardAPIURL() {
    this.info('API URL Copied');
  }

  public clipboardCopyQueue(lineCount: number, isFileIDs: boolean) {
    const contentType = isFileIDs ? 'File ID' : 'URL';
    const s = lineCount > 1 ? 's' : '';

    this.info(
      `${lineCount} ${contentType}${s} Copied`,
      'Clipboard Updated'
    );
  }

  public clipboardCopyIcon(prompt: string, count: number) {
    const contentType = prompt.includes('ID') ? 'File ID' : 'Scene name';
    let headerText: string;
    let infoText: string;

    if (count > 1) {
      headerText = `${contentType}s Copied`;
      infoText = `${count} ${contentType}s copied`;

      this.info(infoText, headerText);
    } else {
      infoText = `${contentType} Copied`;

      this.info(infoText);
    }
  }

  public closeFiltersPanel() {
    this.info('Filters dismissed and not applied');
  }
  public info(message: string, title = '', options= {}): ActiveToast<any> {
    return this.toastr.info(message, title, {...options, ...this.toastOptions});
  }
  public error(message: string, title = '', options= {}): ActiveToast<any> {
    return this.toastr.error(message, title, {...options, ...this.toastOptions});
  }
}
