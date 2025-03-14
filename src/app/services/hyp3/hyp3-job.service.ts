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

}
