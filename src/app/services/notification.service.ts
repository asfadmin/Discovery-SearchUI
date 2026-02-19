import { Injectable, inject } from '@angular/core';

import { ActiveToast, IndividualConfig, ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import * as uiStore from '@store/ui';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { SearchType } from '@models';

import * as models from '@models';
import { ClearSearch, MakeSearch, SetSearchType } from '@store/search';
import { SetProductTypes, SetSelectedDataset } from '@store/filters';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private toastr = inject(ToastrService);
  private store$ = inject<Store<AppState>>(Store);
  private translateService = inject(TranslateService);

  private shownSignupMessage = false;

  // Custom toastr config example, toastClass styling in styles.scss
  private toastOptions: Partial<IndividualConfig> = {
    // toastClass: 'pinkToast',
    // toastComponent: ToastrMessageComponent
  };

  public demandQueue(
    added = true,
    count = 0,
    job_type: string,
    duplicates = 0,
    application_status = '',
  ) {
    let headerText: string;
    let infoText = '';
    count -= duplicates;
    if (count <= 0) {
      if (duplicates > 1) {
        this.error(
          this.translateService.instant('JOBS_WERE_DUPLICATES'),
          this.translateService.instant('DUPLICATE_JOBS'),
        );
      } else {
        this.error(
          this.translateService.instant('JOB_WAS_DUPLICATE'),
          this.translateService.instant('DUPLICATE_JOB'),
        );
      }
      return;
    }
    if (count > 1) {
      headerText = added
        ? this.translateService.instant('JOBS_ADDED_TO_QUEUE')
        : this.translateService.instant('JOBS_REMOVED_FROM_QUEUE');
      infoText = this.translateService.instant(
        'JOBS_ADDED_TO_ON_DEMAND_QUEUE',
        {
          count,
          jobType: job_type === '' ? '' : job_type + ' ',
        },
      );
      if (duplicates && added) {
        infoText +=
          ' ' +
          this.translateService.instant('DUPLICATE_JOBS_NOT_ADDED', {
            count: duplicates,
            jobWord:
              duplicates > 1
                ? this.translateService.instant('JOBS').toLowerCase()
                : this.translateService.instant('JOB'),
          });
      }

      this.info(infoText, headerText);
    } else {
      infoText = this.translateService.instant('JOB_ADDED_TO_ON_DEMAND_QUEUE', {
        jobType: job_type === '' ? '' : job_type + ' ',
      });

      this.info(
        infoText,
        added
          ? this.translateService.instant('JOB_ADDED_TO_QUEUE')
          : this.translateService.instant('JOB_REMOVED_FROM_QUEUE'),
      );
    }
    if (application_status === 'NOT_STARTED' && !this.shownSignupMessage) {
      this.shownSignupMessage = true;
      this.error(
        this.translateService.instant('CLICK_TO_OPEN_REGISTRATION'),
        this.translateService.instant('NOT_REGISTERED_WITH_ON_DEMAND'),
        {
          disableTimeOut: true,
          closeButton: true,
        },
      ).onTap.subscribe(() => {
        this.store$.dispatch(new uiStore.SetIsOnDemandQueueOpen(true));
      });
    }
  }

  public downloadQueue(added = true, count = 0) {
    let headerText: string;
    let infoText = '';

    if (count > 1) {
      headerText = this.translateService.instant('SCENES_ADDED');
      infoText = added
        ? this.translateService.instant('SCENES_ADDED_TO_DOWNLOAD_QUEUE', {
            count,
          })
        : this.translateService.instant('SCENES_REMOVED_FROM_DOWNLOAD_QUEUE', {
            count,
          });
      this.info(infoText, headerText);
    } else {
      infoText = added
        ? this.translateService.instant('SCENE_ADDED_TO_DOWNLOAD_QUEUE')
        : this.translateService.instant('SCENE_REMOVED_FROM_DOWNLOAD_QUEUE');
      this.info(infoText);
    }
  }

  public clipboardSearchLink() {
    this.info(this.translateService.instant('SEARCH_LINK_COPIED'));
  }

  public clipboardAPIURL() {
    this.info(this.translateService.instant('API_URL_COPIED'));
  }

  public clipboardCopyQueue(lineCount: number, isFileIDs: boolean) {
    const contentType = isFileIDs
      ? this.translateService.instant('FILE_ID')
      : this.translateService.instant('URL');
    const copied = this.translateService.instant('COPIED');

    this.info(
      `${lineCount} ${contentType}${lineCount > 1 ? 's' : ''} ${copied}`,
      this.translateService.instant('CLIPBOARD_UPDATED'),
    );
  }

  public clipboardCopyIcon(prompt: string, count: number) {
    let contentType = prompt.includes('ID')
      ? this.translateService.instant('FILE_ID')
      : this.translateService.instant('SCENE_NAME');
    if (prompt.toLocaleLowerCase().includes('event')) {
      contentType = contentType.replace(
        this.translateService.instant('FILE'),
        this.translateService.instant('EVENT'),
      );
    }
    const copied = this.translateService.instant('COPIED');

    let headerText: string;
    let infoText: string;

    if (count > 1) {
      headerText = `${contentType}s ${copied}`;
      infoText = `${count} ${contentType}s ${copied.toLowerCase()}`;

      this.info(infoText, headerText);
    } else {
      infoText = `${contentType} ${copied}`;

      this.info(infoText);
    }
  }

  public linkCopyIcon(prompt: string, count: number) {
    const contentType = prompt.includes('S3')
      ? this.translateService.instant('S3_URL')
      : this.translateService.instant('DOWNLOAD_URL');
    const copied = this.translateService.instant('COPIED');

    let headerText: string;
    let infoText: string;

    if (count > 1) {
      headerText = `${contentType}s ${copied}`;
      infoText = `${count} ${contentType}s ${copied.toLowerCase()}`;

      this.info(infoText, headerText);
    } else {
      infoText = `${contentType} ${copied}`;

      this.info(infoText);
    }
  }

  public closeFiltersPanel() {
    this.info(this.translateService.instant('FILTERS_DISMISSED_NOT_APPLIED'));
  }

  public rawDataHidden() {
    const title = this.translateService.instant('HIDING_RAW_RESULTS');
    const message = this.translateService.instant('CLICK_TO_SHOW_RAW_RESULTS');

    const toast = this.info(message, title);
    toast.onTap
      .pipe(take(1))
      .subscribe((_) => this.store$.dispatch(new uiStore.ShowS1RawData()));
  }

  public listImportFailed(fileExtension: string) {
    const title = this.translateService.instant('LIST_IMPORT_FAILED', {
      extension: fileExtension,
    });
    const message = this.translateService.instant(
      'CLICK_TO_OPEN_FILE_FORMAT_DOCS',
    );
    const errorToast = this.error(message, title);
    errorToast.onTap
      .pipe(take(1))
      .subscribe((_) =>
        window.open(
          'https://docs.asf.alaska.edu/vertex/manual/#list-search-file-import',
        ),
      );
  }

  public redirectTo(message_key: string, searchRedirectInfo: SearchRedirect) {
    const title = this.translateService.instant('SEARCH_TYPE_NOTICE');
    const message = this.translateService.instant(message_key);
    const errorToast = this.error(message, title);
    errorToast.onTap.pipe(take(1)).subscribe((_) => {
      switch (searchRedirectInfo.searchType) {
        case SearchType.DATASET: {
          const filters = searchRedirectInfo.filters;
          const dataset = models.datasetList.filter(
            (d) => d.id === filters.selectedDataset,
          )[0];

          const actions = [
            new SetSearchType(SearchType.DATASET),
            new ClearSearch(),
            new SetSelectedDataset(dataset.id),
            new SetProductTypes(filters.productTypes),
            new MakeSearch(),
          ];

          actions.forEach((action) => {
            this.store$.dispatch(action);
          });

          break;
        }
        default:
          console.log('unimplemented');
      }
    });
  }

  public info(
    message: string,
    title = '',
    options: Partial<IndividualConfig> = {},
  ): ActiveToast<any> {
    return this.toastr.info(message, title, {
      ...options,
      ...this.toastOptions,
    });
  }

  public error(
    message: string,
    title = '',
    options: Partial<IndividualConfig> = {},
  ): ActiveToast<any> {
    // Intentionally uses warning() instead of error() to avoid bright red toast
    // which was deemed too visually jarring for the UX
    return this.toastr.warning(message, title, {
      ...options,
      ...this.toastOptions,
    });
  }
}

export interface SearchRedirect {
  searchType: SearchType;
  filters: { selectedDataset: string; productTypes: models.ProductType[] };
}
