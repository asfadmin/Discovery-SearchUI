import { Injectable } from '@angular/core';

import * as models from '@models';

@Injectable({
  providedIn: 'root'
})
export class OnDemandService {

  constructor() { }

  public jobParamsToList(metadata: models.CMRProductMetadata) {
    const jobType = models.hyp3JobTypes[<string>metadata.job.job_type];
    const allOptions = !!jobType ? jobType.options : models.hyp3JobOptionsOrdered;

    const addedOptions = new Set(['granules', 'scenes']);

    const knownOptions = allOptions
      .filter(option => metadata.job.job_parameters[option.apiName])
      .map(option => {
        addedOptions.add(option.apiName);

        return {name: option.name, val: metadata.job.job_parameters[option.apiName]};
      });

    const unknownOptions = Object.entries(metadata.job.job_parameters)
      .filter(([param, _]) => !addedOptions.has(param))
      .map(([param, val]) => {
        const name = this.formatJobParamName(param);
        return ({name, val});
    });

    return [...knownOptions, ...unknownOptions];
  }

  private formatJobParamName(apiName: string): string {
  return apiName.toLowerCase()
    .replaceAll('_', ' ')
    .replaceAll('dem', 'DEM')
    .replaceAll('rgb', 'RGB')
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
  }
}
