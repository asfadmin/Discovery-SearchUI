import { Pipe, PipeTransform } from '@angular/core';

import { Dataset, Props } from '@models';

@Pipe({ name: 'isRelevant' })
export class IsRelevantPipe implements PipeTransform {
  transform(dataset: Dataset | undefined, prop: Props): boolean {
    return dataset?.properties.includes(prop) ?? false;
  }
}
