import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'join'
})
export class JoinPipe implements PipeTransform {
    transform(input: Array<any>, delimiter = ''): string {
        return input.join(delimiter);
    }
}
