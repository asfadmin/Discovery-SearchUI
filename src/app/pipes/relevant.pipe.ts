import { Pipe, PipeTransform } from '@angular/core';

import { Dataset, Props } from '@models';

@Pipe({ name: 'isRelevant' })
export class IsRelevantPipe implements PipeTransform {
  transform(input: Dataset, prop: Props): boolean {
    const currentDataset = input;

    return currentDataset.properties.includes(prop);
  }
}
