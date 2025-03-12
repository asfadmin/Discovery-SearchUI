import { Injectable } from '@angular/core';

import * as moment from 'moment';

import * as models from '@models';

@Injectable({
  providedIn: 'root'
})
export class Hyp3JobStatusService {
  constructor() { }

  public downloadable(products: models.CMRProduct[]): models.CMRProduct[] {
    return products.filter(product => this.isDownloadable(product.metadata.job));
  }

  public isDownloadable(job: models.Hyp3Job): boolean {
    return (
      !job ||
      (
        !this.isPending(job) &&
        !this.isFailed(job) &&
        !this.isRunning(job) &&
        !this.isExpired(job)
      )
    );
  }

  public isExpired(job: models.Hyp3Job): boolean {
    if (job == null) {
      return false;
    }

    return job.status_code === models.Hyp3JobStatusCode.SUCCEEDED &&
      this.expirationDays(job.expiration_time) <= 0;
  }

  public isFailed(job: models.Hyp3Job): boolean {
    return job.status_code === models.Hyp3JobStatusCode.FAILED;
  }

  public isPending(job: models.Hyp3Job): boolean {
    return job.status_code === models.Hyp3JobStatusCode.PENDING;
  }

  public isRunning(job: models.Hyp3Job): boolean {
    return job.status_code === models.Hyp3JobStatusCode.RUNNING;
  }

  private expirationDays(expiration_time: moment.Moment): number {
    const current = moment.utc();

    const expiration = moment.duration(expiration_time.diff(current));

    return Math.floor(expiration.asDays());
  }
}
