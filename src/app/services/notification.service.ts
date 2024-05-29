import { Injectable } from '@angular/core';

import { ActiveToast, IndividualConfig, ToastrService } from 'ngx-toastr';

import * as uiStore from '@store/ui';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private toastr: ToastrService,
    private store$: Store<AppState>,
    ) {}

  // Custom toastr config example, toastClass styling in styles.scss
  private toastOptions: Partial<IndividualConfig> = {
    // toastClass: 'pinkToast',
    // toastComponent: ToastrMessageComponent
  };

  public demandQueue(added: boolean = true, count: number = 0, job_type: string, duplicates = 0, application_status='') {
    let headerText: string;
    let infoText = '';
    const action = added ? 'added to' : 'removed from';
    count -= duplicates;
    if (count <= 0) {
      if (duplicates > 1 ) {
        this.error('All jobs submitted were duplicates', 'Duplicates Jobs');
       } else {
        this.error('Job submitted was a duplicate', 'Duplicate Job');
      }
      return;
    }
    if (count > 1) {
      headerText = `Jobs ${action} queue`;
      infoText = `${count} ${job_type === '' ? '' : job_type + ' '}jobs ${action} the On Demand Queue.`;
      if (duplicates && added) {
        infoText += ` ${duplicates} duplicate ${duplicates > 1 ? 'jobs' : 'job'} not ${action} the queue.`;
      }
      if(application_status === 'NOT_STARTED') {
        infoText += ' Hyp3 Account still needs to be registered.'
      }
      this.info(infoText, headerText);
    } else {
      infoText = `${job_type === '' ? '' : job_type + ' '}job ${action} the On Demand Queue.`;
      if(application_status === 'NOT_STARTED') {
        infoText += ' Hyp3 Account still needs to be registered.'
      }
      this.info(infoText, `Job ${action} queue`);
    }
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
    let contentType = prompt.includes('ID') ? 'File ID' : 'Scene name';
    if (prompt.toLocaleLowerCase().includes('event')) {
      contentType = contentType.replace('File', 'Event');
    }

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

  public rawDataHidden() {
    const title = 'Hiding Raw Results';
    const message = 'Click to show raw results';

    const toast = this.info(message, title);
    toast.onTap.pipe(take(1)).subscribe(_ => this.store$.dispatch(new uiStore.ShowS1RawData()));
  }

  public listImportFailed(fileExtension: string) {
    const title = `${fileExtension} List Import Failed`;
    const message = `Click to open documentation on accepted file formatting`;
    const errorToast = this.error(message, title);
    errorToast.onTap.pipe(take(1)).subscribe(_ => window.open(`https://docs.asf.alaska.edu/vertex/manual/#list-search-file-import`));
  }

  public info(message: string, title = '', options: Partial<IndividualConfig> = {}): ActiveToast<any> {
    return this.toastr.info(message, title, {...options, ...this.toastOptions});
  }

  public error(message: string, title = '', options: Partial<IndividualConfig> = {}): ActiveToast<any> {
    return this.toastr.warning(message, title, {...options, ...this.toastOptions});
  }
}
