import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'floatPrecision',
})
export class FloatPrecisionPipe implements PipeTransform {
  transform(input: number, precision = 2): string {
    return input.toFixed(precision);
  }
}
