import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterExtension'
})
export class FilterExtensionPipe implements PipeTransform {
    transform(input: string): string {
        return input?.split('.')[0];
    }
}
