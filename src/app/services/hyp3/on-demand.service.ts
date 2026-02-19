import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import * as models from '@models';

@Injectable({
  providedIn: 'root',
})
export class OnDemandService {
  private translateService = inject(TranslateService);

  public jobParamsToList(metadata: models.CMRProductMetadata) {
    const jobType = models.hyp3JobTypes[metadata.job.job_type as string];
    const allOptions = jobType ? jobType.options : models.hyp3JobOptionsOrdered;

    const addedOptions = new Set(['granules', 'scenes']);

    const knownOptions = allOptions
      .filter(
        (option) =>
          option.apiName != null &&
          Object.prototype.hasOwnProperty.call(
            metadata.job.job_parameters,
            option.apiName,
          ),
      )
      .map((option) => {
        addedOptions.add(option.apiName);

        return {
          name: option.name,
          val: metadata.job.job_parameters[option.apiName],
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
    const translationKey = apiName.toUpperCase();
    const translated = this.translateService.instant(translationKey);

    if (translated !== translationKey) {
      return translationKey;
    }

    return apiName
      .toLowerCase()
      .replaceAll('_', ' ')
      .replaceAll('dem', 'DEM')
      .replaceAll('rgb', 'RGB')
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');
  }
}
