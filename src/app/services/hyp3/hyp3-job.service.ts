import { Injectable } from '@angular/core';

import * as models from '@models';

@Injectable({
  providedIn: 'root'
})
export class Hyp3JobService {

  constructor() { }

  public formatJobs(
    jobTypesWithQueued: models.JobTypesWithQueued[],
    options: {processingOptions: any, projectName: string}
  ) {
    const jobOptionNames = {};
    models.hyp3JobTypesList.forEach(
      jobType => jobOptionNames[jobType.id] = new Set(
        jobType.options.map(option => option.apiName)
      )
    );

    const ops = {};
    models.hyp3JobTypesList.forEach(jobType => {
      ops[jobType.id] = {};

      Object.entries(options.processingOptions[jobType.id]).forEach(([name, value]) => {
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

      if (!jobOptions.name) {
        delete jobOptions.name;
      }

      return jobOptions;
    });
  }

  public getAllGranulesFromJobs(jobs: models.Hyp3Job[]): string[] {
    return jobs.reduce(
      (granuleNames, job) => {
        const jobGranules = this.getAllGranules(job)

        return granuleNames.concat(jobGranules);
      },
      []);
  }


  public getAllGranules(job: models.Hyp3Job): string[]  {
    return job.job_parameters.granules;
  }

  public toCMRProducts(jobs: models.Hyp3Job[], products: {[granuleId: string]: models.CMRProduct}) {
    const virtualProducts = jobs
    .filter(job => {
        const jobGranules = this.getAllGranules(job);
        return jobGranules && products[jobGranules[0]];
    })
    .map(job => {
      const jobGranules = this.getAllGranules(job);
      const product = products[jobGranules[0]];

      const jobFile = job.files?.length > 0 ?
        job.files[0] :
        { size: -1, url: '', filename: product.name };

      job.scenes = jobGranules
        .map(granuleName => products[granuleName]);

      const jobProduct = {
        ...product,
        browses: job.browse_images ? job.browse_images : ['assets/no-browse.png'],
        thumbnail: job.thumbnail_images ? job.thumbnail_images[0] : 'assets/no-thumb.png',
        productTypeDisplay: `${job.job_type}, ${product.metadata.productType} `,
        downloadUrl: jobFile.url,
        bytes: jobFile.size,
        groupId: job.job_id,
        id: job.job_id,
        isDummyProduct: true,
        metadata: {
          ...product.metadata,
          fileName: jobFile.filename || '',
          productType: job.job_type,
          job
        },
      };

      return jobProduct
    });

    return virtualProducts;
  }
}
