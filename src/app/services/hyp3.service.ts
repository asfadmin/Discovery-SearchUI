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

  public getHyp3ableProducts(products: models.CMRProduct[][]): models.Hyp3ableProductByJobType[] {
    return models.hyp3JobTypesList.map(jobType => {
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
    });
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
}
