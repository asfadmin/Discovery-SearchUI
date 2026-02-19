import { Injectable } from '@angular/core';

import * as models from '@models';

@Injectable({
  providedIn: 'root',
})
export class OnDemandService {
  public jobParamsToList(metadata: models.CMRProductMetadata) {
    const jobType = models.hyp3JobTypes[metadata.job.job_type as string];
    const allOptions = jobType ? jobType.options : models.hyp3JobOptionsOrdered;

    const addedOptions = new Set(['granules', 'scenes']);

    const jobParams = metadata.job.job_parameters;

    const knownOptions = allOptions
      .filter(
        (option) =>
          option.apiName != null && jobParams.hasOwnProperty(option.apiName),
      )
      .map((option) => {
        addedOptions.add(option.apiName);

        return {
          name: option.name,
          val: jobParams[option.apiName],
        };
      });

    const unknownOptions = Object.entries(metadata.job.job_parameters)
      .filter(([param, _]) => !addedOptions.has(param))
      .map(([param, val]) => {
        const name = this.formatJobParamName(param);
        return { name, val };
      });

    return [...knownOptions, ...unknownOptions];
  }

  private formatJobParamName(apiName: string): string {
    return apiName.toUpperCase();
  }
}
