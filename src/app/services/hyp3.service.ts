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

  public getJobs$(): Observable<models.Hyp3Job[]> {
    const getJobsUrl = `${this.apiUrl}/jobs`;
    return this.http.get(getJobsUrl, { withCredentials: true }).pipe(
      map((resp: any) => {
        if (!resp.jobs) {
          // TODO: Notify user when there is an error
          return [];
        }

        const { jobs } = resp;

        return jobs.map(job => ({
          ...job,
          expiration_time: moment.utc(job.expiration_time),
          request_time: moment.utc(job.request_time)
        }));
      })
    );
  }

  public submiteJobBatch$(jobBatch) {
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
        byProdType[prodType].push(product);
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
