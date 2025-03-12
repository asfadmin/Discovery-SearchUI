import { Injectable } from '@angular/core';

import * as models from '@models';

@Injectable({
  providedIn: 'root'
})
export class OnDemandService {

  constructor() { }

  public jobParamsToList(metadata) {
    const jobType = models.hyp3JobTypes[metadata.job.job_type];
    const allOptions = !!jobType ? jobType.options : models.hyp3JobOptionsOrdered;

    return allOptions
      .filter(option => metadata.job.job_parameters[option.apiName])
      .map(option => {
        return {name: option.name, val: metadata.job.job_parameters[option.apiName]};
      });
  }

}
