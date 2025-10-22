import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'join',
    standalone: false
})
export class JoinPipe implements PipeTransform {
  transform(input: any[], delimiter = ''): string {
    return input.join(delimiter);
  }
}
