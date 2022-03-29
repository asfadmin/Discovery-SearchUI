import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { EnvironmentService } from './environment.service';
import * as models from '@models';

@Injectable({
  providedIn: 'root'
})
export class Hyp3Service {
  constructor(
    private http: HttpClient,
    private env: EnvironmentService,
  ) { }

  public get apiUrl() {
    return this.env.currentEnv.hyp3_api;
  }

  public getUser$(): Observable<models.Hyp3User> {
    const getUserUrl = `${this.apiUrl}/user`;

    return this.http.get<models.Hyp3User>(getUserUrl, { withCredentials: true });
  }

  public formatJobs(jobTypesWithQueued, options: {processingOptions: any, projectName: string}) {
    const jobOptionNames = {};
    models.hyp3JobTypesList.forEach(
      jobType => jobOptionNames[jobType.id] = new Set(
        jobType.options.map(option => option.apiName)
      )
    );

    const ops = {};
    models.hyp3JobTypesList.forEach(jobType => {
      ops[jobType.id] = {};

      Object.entries(options.processingOptions).forEach(([name, value]) => {
        if (jobOptionNames[jobType.id].has(name)) {
          ops[jobType.id][name] = value;
        }
      });
    });

    const jobs = jobTypesWithQueued
      .filter(jobType => jobType.selected)
      .map(jobType => jobType.jobs)
      .reduce((acc, val) => acc.concat(val), []);

    return jobs.map(job => {
      const jobOptions: any = {
        job_type: job.job_type.id,
        job_parameters: {
          ...ops[job.job_type.id],
          granules: job.granules.map(granule => granule.name),
        }
      };

      if (options.projectName !== '') {
        jobOptions.name = options.projectName;
      }

      return jobOptions;
    });
  }

  public getJobs$(): Observable<{hyp3Jobs: models.Hyp3Job[], next: string}> {
    const getJobsUrl = `${this.apiUrl}/jobs`;
    return this.getJobsByUrl$(getJobsUrl);
  }

  public getJobsByUrl$(url: string): Observable<{hyp3Jobs: models.Hyp3Job[], next: string}> {
    return this.http.get(url, { withCredentials: true }).pipe(
      map((resp: any) => {
        if (!resp.jobs) {
          // TODO: Notify user when there is an error
          return {hyp3Jobs: [], next: ''};
        }

        const { jobs, next } = resp;

        const hyp3Jobs = jobs.map(job => ({
          ...job,
          expiration_time: moment.utc(job.expiration_time),
          request_time: moment.utc(job.request_time)
        }));

        return {hyp3Jobs, next};
      })
    );
  }

  public submitJobBatch$(jobBatch) {
    const submitJobUrl = `${this.apiUrl}/jobs`;

    return this.http.post(submitJobUrl, jobBatch, { withCredentials: true });
  }

  public submitJob$(granuleId: string, name?: string) {
    const submitJobUrl = `${this.apiUrl}/jobs`;

    const body = {
      jobs: [{
        name: name || 'RTC HyP3 job',
        job_parameters: {
          granules: [granuleId]
        },
        job_type: 'RTC_GAMMA'
      }]
    };

    return this.http.post(submitJobUrl, body, { withCredentials: true });
  }

  public editSubscription(subId: string, edit: {enabled?: boolean, end?: string}) {
    const subscriptionUrl = `${this.apiUrl}/subscriptions/${subId}`;

    return this.http.patch(subscriptionUrl, edit, { withCredentials: true });
  }

  public submitSubscription$(sub) {
    const submitUrl = `${this.apiUrl}/subscriptions`;

    return this.http.post(submitUrl, sub, { withCredentials: true });
  }

  public getSubscriptions$(): Observable<models.OnDemandSubscription[]> {
    const subscriptionsUrl = `${this.apiUrl}/subscriptions`;

    return this.http.get(subscriptionsUrl, { withCredentials: true }).pipe(
      map((resp: any) => {
        return resp.subscriptions.map((sub) => {
          return  {
            name: sub.job_specification.name,
            id: sub.subscription_id,
            jobParameters: sub.job_specification,
            jobType: models.hyp3JobTypes[sub.job_specification.job_type],
            filters: sub.search_parameters,
            enabled: sub.enabled
          };
        });
      })
    );
  }

  public getHyp3ableProducts(products: models.CMRProduct[][]): {byJobType: models.Hyp3ableProductByJobType[]; total: number} {
    const byJobType = models.hyp3JobTypesList.map(jobType => {
      const hyp3ableProducts = products.filter(
        product => this.isHyp3able(product, jobType)
      );

      const byProdType: {[key: string]: models.CMRProduct[][]} = jobType.productTypes.reduce(
        (types, prodType) => {
          prodType.productTypes.forEach(pt => {
            types[pt] = [];
          });
          return types;
        }, {}
      );

      hyp3ableProducts.forEach(product => {
        const prodType = product[0].metadata.productType;
        byProdType[prodType].push(product?.sort((a, b) => {
          if (a.metadata.date < b.metadata.date) {
            return -1;
          }
          return 1;
        }));
      });

      const byProductType: models.Hyp3ableByProductType[] = Object.entries(byProdType).map(([productType, prods]) => ({
          productType, products: <any>prods
        }));

      return {
        jobType,
        byProductType,
        total: Object.values(byProdType).reduce(
          (sum, prods) => sum + (<any>prods).length, 0
        )
      };
    }).filter(hyp3able => hyp3able.total > 0);

    const total = byJobType.reduce((sum, jobType) => sum + jobType.total , 0);

    return ({ byJobType, total });
  }

  public getValidJobTypes(product: models.CMRProduct[]): models.Hyp3JobType[] {
    return models.hyp3JobTypesList.filter(jobType => this.isHyp3able(product, jobType));
  }

  public isHyp3able(products: models.CMRProduct[], jobType: models.Hyp3JobType): boolean {
    return (
      products.length === jobType.numProducts &&
      jobType.productTypes.some(productType => {
        const types = new Set(productType.productTypes);
        const pols = new Set(productType.polarizations);
        const beamModes = new Set(productType.beamModes);

        return products.every(product =>
          types.has(product.metadata.productType) &&
          pols.has(product.metadata.polarization) &&
          beamModes.has(product.metadata.beamMode)
        );
      })
    );
  }

  public downloadable(products: models.CMRProduct[]): models.CMRProduct[] {
    return products.filter(product => this.isDownloadable(product));
  }

  public isDownloadable(product: models.CMRProduct): boolean {
    return (
      !product.metadata.job ||
      (
        !this.isPending(product.metadata.job) &&
        !this.isFailed(product.metadata.job) &&
        !this.isRunning(product.metadata.job) &&
        !this.isExpired(product.metadata.job)
      )
    );
  }

  public isExpired(job: models.Hyp3Job): boolean {
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
