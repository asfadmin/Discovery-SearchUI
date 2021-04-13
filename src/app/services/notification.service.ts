import { Injectable } from '@angular/core';
import  {
        // IndividualConfig,
          ToastrService
        } from 'ngx-toastr';
// import { ToastrMessageComponent } from 'src/app/components/shared/toastr-message/toastr-message.component'
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) {}

  // Custom toastr config example, toastClass styling in styles.scss
  // private exampleCustomToastConfig: Partial<IndividualConfig> = {
  //   toastClass: 'pinkToast',
  //   toastComponent: ToastrMessageComponent
  // };

  public demandQueue(added: boolean = true, count: number = 0, job_type: string) {
    let headerText: string;
    let infoText = '';
    if (count > 1) {
      headerText = 'Jobs Added';
      infoText = count + ' ' + job_type + ' jobs ' + (added ? 'added to' : 'removed from') + ' the On Demand Queue';
      this.toastr.info(infoText, headerText);
    } else {
      infoText = job_type + ' job' + (added ? ' added to' : ' removed from') + ' the On Demand Queue';
      this.toastr.info(infoText);
    }
  }

  public jobsSubmitted(count: number) {
    const infoText = (count > 1 ? count + ' jobs' : 'Job') + ' processing';
    this.toastr.info(infoText, 'Jobs Submitted');
  }

  public downloadQueue(added: boolean = true, count: number = 0) {
    let headerText: string;
    let infoText = '';
    if (count > 1) {
      headerText = 'Scenes Added';
      infoText = count + ' scenes ' + (added ? 'added to' : 'removed from') + ' the Download Queue';
      this.toastr.info(infoText, headerText);
    } else {
      infoText = 'Job ' + (added ? 'added to' : 'removed from') + ' the Download Queue';
      this.toastr.info(infoText);
    }
  }

  public clipboardSearchLink() {
    this.toastr.info('Search Link Copied');
  }

  public clipboardAPIURL() {
    this.toastr.info('API URL Copied');
    // this.toastr.info('', 'API URL Copied', {
    //   toastComponent: ToastrMessageComponent
    // });
  }

  public clipboardCopyQueue(lineCount: number, isFileIDs: boolean) {
    const contentType = isFileIDs ? ' File ID' : ' URL';
    const s = lineCount > 1 ? 's' : '';
    this.toastr.info(lineCount + contentType + s + ' Copied', 'Clipboard Updated');
  }

  public clipboardCopyIcon(prompt: string, count: number) {
    let contentType: string;
    let headerText: string;
    let infoText: string;

    if (prompt.includes('ID')) {
      contentType =  'File ID';
    } else {
      contentType = 'Scene name';
    }

    if (count > 1) {
      headerText =  contentType + 's Copied';
      infoText = count + ' ' + contentType + 's copied';
      this.toastr.info(infoText, headerText);
    } else {
      infoText = contentType + ' Copied';
      this.toastr.info(infoText);
    }
  }
}
