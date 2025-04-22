import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'polarizationCount',
    standalone: false
})
export class PolarizationCountPipe implements PipeTransform {
    transform(input: string): string {
        let count = (input.match(/,/g)||[]).length;
        let bands = {
            0: 'Single-Pol',
            1: 'Dual-Pol',
            3: 'Quad-Pol'
        }
        if(bands.hasOwnProperty(count)) {
            return `${bands[count]}`;
        }
        else {
            return '';
        }
    }
}
