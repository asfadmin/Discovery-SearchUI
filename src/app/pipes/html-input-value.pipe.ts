import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'htmlInputValue'
})
export class HTMLInputValuePipe implements PipeTransform {
    transform(input: Event): string {
        return (input.target as HTMLInputElement).value;
    }
}
