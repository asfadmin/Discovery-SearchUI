import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'floatPrecision'
})
export class FloatPrecisionPipe implements PipeTransform {
    transform(input: Number, precision=2): string {
        return input.toFixed(precision);
    }
}
